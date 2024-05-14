/* eslint-disable no-console */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { authenticateUser } from '../../../../packages/database/src/index.ts'
import { flushMarkersTable, insertMarkers } from '../../../../packages/database/src/index.ts'
import { getCryptocities, getLocations } from '../../../../packages/database/src/index.ts'
import { algorithm, computeMarkers, euclideanDistance } from '../../../../packages/geo/src/index.ts'
import type { Args, AuthWriteDbFunction, InsertMarkersSingleCryptocity } from '../../../../packages/types/src/database.ts'
import type { BoundingBox } from '../../../../packages/types/src/index.ts'

async function markers() {
  const url = Deno.env.get('SUPABASE_URL')
  const apikey = Deno.env.get('SUPABASE_ANON_KEY')
  const email = Deno.env.get('DB_AUTH_EMAIL')
  const password = Deno.env.get('DB_AUTH_PASSWORD')
  const minZoom = Number(Deno.env.get('MIN_ZOOM')) || 3
  const maxZoom = Number(Deno.env.get('MAX_ZOOM')) || 14

  if (!apikey || !url || !email || !password) {
    console.log({ apikey, url, email, password })
    throw new Error('Missing environment variables')
  }

  const dbArgs = await authenticateUser({ apikey, url, auth: { email, password } })

  console.log('Flushing cluster table...')
  await flushMarkersTable(dbArgs)

  const boundingBox: BoundingBox = { neLat: 90, neLng: 180, swLat: -90, swLng: -180 }

  const locations = await getLocations(dbArgs, boundingBox)
  console.log(`Found ${locations.length} locations`)

  type Radii = Record<number /* minZoom, maxZoom */, number /* the radius for minZoom is 120, the radius for maxZoom is 150 */>
  const radii: Radii = Array.from({ length: maxZoom - minZoom + 1 }, (_, i) => 120 + i * 30 / (maxZoom - minZoom))
    .reduce((acc, radius, i) => ({ ...acc, [minZoom + i]: radius }), {})

  console.log('Computing clusters...')

  const promises: Promise<unknown>[] = []

  const cryptocities = await getCryptocities(dbArgs, { boundingBox, excludedCities: [] })
  if (!cryptocities || cryptocities.length === 0)
    throw new Error('No cryptocities found')

  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    const { singles, clusters: locationClusters } = computeMarkers(algorithm(radii[zoom]), locations, { zoom, boundingBox })

    const singlesToAdd: Args[AuthWriteDbFunction.InsertMarkers]['items'] = singles.map(({ lng, lat, uuid }) => ({ lat, lng, count: 1, locationUuid: uuid }))

    const clustersWithCryptocurrencies = [...locationClusters, ...cryptocities]
    const { singles: singlesItems } = computeMarkers(algorithm(radii[zoom]), clustersWithCryptocurrencies, { zoom, boundingBox })

    const singlesCryptocities: InsertMarkersSingleCryptocity[]
      = (singlesItems.filter(c => 'city' in c) as typeof cryptocities)
        .map(({ lng, lat, city }) => ({ lat, lng, count: 1, cryptocities: [city] }))

    // Cryptocities no in singles
    const attachedCryptocities = cryptocities.filter(c => !singlesCryptocities.find(s => s.cryptocities[0] === c.city))

    // Find the closest cluster for each cryptocity
    for (const attachedCity of attachedCryptocities) {
      const closestCluster = locationClusters
        .map(cluster => ({ ...cluster, distance: euclideanDistance(cluster, attachedCity) }))
        .sort((a, b) => a.distance - b.distance)[0]
      closestCluster.cryptocities.push(attachedCity.city)
    }

    promises.push(insertMarkers(dbArgs, { zoom_level: zoom, items: singlesToAdd.concat(locationClusters).concat(singlesCryptocities) }))

    console.log(`Added ${locationClusters.length} clusters and ${singles.length} singles at zoom level ${zoom}`)
  }

  await Promise.allSettled(promises)

  console.log('Done')
}

serve(async () => {
  try {
    console.log('Starting markers...')
    await markers()
    return new Response(undefined, { status: 201 })
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

markers()
