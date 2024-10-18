import type { CryptocityType } from '~~/types/cryptocity'
import type { BoundingBox } from '~~/types/map'
import type { Database, Json } from '~~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'
import { algorithm, computeMarkers } from '~~/lib/compute-markers'
import { euclideanDistance } from '~~/lib/geo-utilities'
import { createConsola } from 'consola/core'

// TODO Figure out how to invoke this

type Radii = Record<number /* minZoom, maxZoom */, number /* the radius for minZoom is 120, the radius for maxZoom is 150 */>
const MIN_ZOOM = 3
const MAX_ZOOM = 14
const radii: Radii = Array.from({ length: MAX_ZOOM - MIN_ZOOM + 1 }, (_, i) => 120 + i * 30 / (MAX_ZOOM - MIN_ZOOM))
  .reduce((acc, radius, i) => ({ ...acc, [MIN_ZOOM + i]: radius }), {})

export default defineEventHandler(async (event) => {
  const consola = createConsola({ level: 3 })
  consola.info('Computing clusters')

  const client = await serverSupabaseClient<Database>(event)

  const { supabaseAdminEmail: email, supabaseAdminPassword: password } = useRuntimeConfig()
  client.auth.signInWithPassword({ email, password })
  consola.debug('Signed in as admin')

  consola.log('Flushing clusters')
  await client.rpc('flush_markers_table')

  const boundingBox: BoundingBox = { nelat: 90, nelng: 180, swlat: -90, swlng: -180 }

  const { data: locations, error: errorLocations } = await client.rpc('get_locations', { ...boundingBox, page_size: 30000 })
  if (errorLocations)
    return new Error(`Error getting locations: ${errorLocations.message}`)

  const { data: cryptocities, error: cryptocitiesError } = await client.rpc('get_cryptocities', { ...boundingBox, excluded_cities: [] })
  if (cryptocitiesError)
    return new Error(`Error getting cryptocities: ${cryptocitiesError.message}`)
  consola.info(`Found ${cryptocities.length} cryptocities`)

  consola.info('Computing clusters')

  for (let zoom = MIN_ZOOM; zoom <= MAX_ZOOM; zoom++) {
    const { singles, clusters: locationClusters } = computeMarkers(algorithm(radii[zoom]), locations, { zoom, boundingBox })

    interface ClusterInsert { lat: number, lng: number, count: number, zoom: number, locationUuid?: string, cryptocities?: string[], geo_location?: string }
    const singlesToAdd: ClusterInsert[] = singles.map(({ lng, lat, uuid }) => ({ zoom, count: 1, locationUuid: uuid, lat, lng }))
    // const locationClustersToAdd: ClusterInsert[] = locationClusters.map(({ lng, lat, count, expansionZoom }) => ({ zoom, count, lat, lng, expansionZoom }))
    // const singlesCryptocitiesToAdd: ClusterInsert[] = cryptocities.filter(c => 'city' in c).map(({ lng, lat, city }) => ({ zoom, count: 1, cryptocities: [city], lat, lng }))

    const clustersWithCryptocurrencies = [...locationClusters, ...cryptocities]
    const { singles: singlesItems } = computeMarkers(algorithm(radii[zoom]), clustersWithCryptocurrencies, { zoom, boundingBox })
    const singlesCryptocities: ClusterInsert[]
      = (singlesItems.filter(c => 'city' in c) as typeof cryptocities)
        .map(({ lng, lat, city }) => ({ zoom, lat, lng, count: 1, cryptocities: [city] }))

    // Cryptocities no in singles
    const attachedCryptocities = cryptocities.filter(c => !singlesCryptocities.find(s => s.cryptocities?.at(0) === c.city))

    // Find the closest cluster for each cryptocity
    for (const attachedCity of attachedCryptocities) {
      const closestCluster = locationClusters
        .map(cluster => ({ ...cluster, distance: euclideanDistance(cluster, attachedCity) }))
        .sort((a, b) => a.distance - b.distance)[0]
      closestCluster.cryptocities.push(attachedCity.city as CryptocityType)
    }

    const markers = singlesToAdd.concat(locationClusters).concat(singlesCryptocities)
    const { error } = await client.rpc('insert_markers', { zoom_level: zoom, items: markers as unknown as Json[] })
    if (error)
      console.error(`Error inserting markers: ${error.message}`)
  }
  return new Response('Clusters computed', { status: 200 })
})
