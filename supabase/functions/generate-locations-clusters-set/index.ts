/* eslint-disable no-console */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { flushClusterTable, insertLocationsClusterSet } from '../../../database/functions.ts'
import { getLocations } from '../../../database/getters.ts'
import { algorithm, computeCluster } from '../../../shared/compute-cluster.ts'
import type { DatabaseAuthArgs, InsertLocationsClustersSetParamsItem } from '../../../types/database.ts'
import { Cryptocity } from '../../../types/database.ts'
import type { BoundingBox, Cluster, Location } from '../../../types/index.ts'
import { getAuth } from '../../../database/fetch.ts'

async function cluster() {
  const url = Deno.env.get('SUPABASE_URL')
  const apikey = Deno.env.get('SUPABASE_ANON_KEY')
  const email = Deno.env.get('DB_AUTH_EMAIL')
  const password = Deno.env.get('DB_AUTH_PASSWORD')

  if (!apikey || !url || !email || !password) {
    console.log({ apikey, url, email, password })
    throw new Error('Missing environment variables')
  }

  const dbArgs: DatabaseAuthArgs = {
    apikey,
    url,
    auth: {
      email,
      password,
    },
    token: '',
  }

  await flushClusterTable(dbArgs)

  const boundingBox: BoundingBox = { neLat: 90, neLng: 180, swLat: -90, swLng: -180 }
  dbArgs.token = await getAuth(dbArgs)
  const locations = await getLocations(dbArgs, boundingBox)
  const cryptocities = Object.values(Cryptocity)
  // print unique cryptocities
  console.log(new Set(locations.map(l => l.cryptocity)))
  const locationsByCryptocity: Record<Cryptocity, Location[]>
    = cryptocities.reduce((acc, cryptocity) => ({
      ...acc, [cryptocity]: locations.filter(l => l.cryptocity === cryptocity),
    }), {} as Record<Cryptocity, Location[]>)
  console.log(locationsByCryptocity['San Jose'].length)
  console.log(locationsByCryptocity.Mannheim.length)
  console.log(locationsByCryptocity.None.length)

  const minZoom = Number(Deno.env.get('MIN_ZOOM')) || 3
  const maxZoom = Number(Deno.env.get('MAX_ZOOM')) || 14

  type Radii = Record<number /* minZoom, maxZoom */, number /* radius in minZoom is 120, maxZoom is 150 */>
  const radii: Radii = Array.from({ length: maxZoom - minZoom + 1 }, (_, i) => 120 + i * 30 / (maxZoom - minZoom))
    .reduce((acc, radius, i) => ({ ...acc, [minZoom + i]: radius }), {})

  const promises: Promise<unknown>[] = []
  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    for (const cryptocity of cryptocities) {
      const res = computeCluster(algorithm(radii[zoom]), locationsByCryptocity![cryptocity], { zoom, boundingBox })
      console.log({ cryptocity })
      const singles: InsertLocationsClustersSetParamsItem[] = (res.singles as Location[])
        .map(({ lng, lat, uuid }) => ({ lat, lng, count: 1, locationUuid: uuid }))
      promises.push(insertLocationsClusterSet(dbArgs, {
        zoom_level: zoom,
        items: singles.concat(res.clusters as Cluster[]),
        cryptocity: cryptocity === Cryptocity.None ? undefined : cryptocity,
      }))
      console.log(
      `Added ${res.clusters.length} clusters and ${singles.length} singles at zoom level ${zoom} for cryptocity ${cryptocity}`,
      )
    }
  }

  const res = await Promise.allSettled(promises)
  // console.log(res.filter(({ status }) => status === 'rejected'))
}

serve(async () => {
  try {
    await cluster()
    return new Response(undefined, { status: 201 })
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
