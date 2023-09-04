/* eslint-disable no-console */

import Supercluster from 'supercluster'
import { load } from 'https://deno.land/std@0.199.0/dotenv/mod.ts'
import type { BoundingBox, Cluster, Location } from '../../types/index.ts'
import { getLocations } from '../../database/getters.ts'
import type { DatabaseAuthArgs, InsertLocationsClustersSetParamsItem } from '../../types/database.ts'
import { computeCluster } from '../../shared/compute-cluster.ts'
import { flushClusterTable, insertLocationsClusterSet } from '../../database/functions.ts'

const env = await load()

function error(message: string): never {
  throw new Error(message)
}

const url = env.DB_URL || error('DB_URL not set')
const apikey = env.DB_AUTH_KEY || error('DB_AUTH_KEY not set')
const email = env.DB_AUTH_EMAIL || error('DB_AUTH_EMAIL not set')
const password = env.DB_AUTH_PASSWORD || error('DB_AUTH_PASSWORD not set')
const dbArgs: DatabaseAuthArgs = { apikey, url, auth: { email, password } }

await flushClusterTable(dbArgs)

const bbox: BoundingBox = { neLat: 90, neLng: 180, swLat: -90, swLng: -180 }
const locations = await getLocations(dbArgs, bbox)

const BASE_RADIUS = 140
const DECAY_FACTOR = 1.05

const minZoom = Number(env.MIN_ZOOM) || 3
const maxZoom = Number(env.MAX_ZOOM) || 14
for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
  const algorithm = new Supercluster({ radius: BASE_RADIUS / DECAY_FACTOR ** zoom })
  const res = computeCluster(algorithm, locations, { zoom, boundingBox: bbox })
  const singles: InsertLocationsClustersSetParamsItem[] = (res.singles as Location[]).map(({ lng, lat, uuid }) => ({ lat, lng, count: 1, locationUuid: uuid }))
  const clusters: InsertLocationsClustersSetParamsItem[] = (res.clusters as Cluster[]).map(({ center: { lat, lng }, count, expansionZoom }) => ({ lat, lng, count, expansionZoom }))
  await insertLocationsClusterSet(dbArgs, { zoom_level: zoom, items: singles.concat(clusters) })
  console.log(`Added ${clusters.length} clusters and ${singles.length} singles at zoom level ${zoom}`)
}
