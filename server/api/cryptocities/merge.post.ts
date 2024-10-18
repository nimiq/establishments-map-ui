import type { Database } from '~~/types/supabase'
import type { Feature, FeatureCollection, Polygon } from 'geojson'
import { serverSupabaseClient } from '#supabase/server'
import { feature, featureCollection, union } from '@turf/turf'
import { getGeoJson } from '~~/server/lib/cryptocity-utils'
import { createConsola } from 'consola'
import { z } from 'zod'

const cityRe = /^[A-Z][a-z]*(?:_[A-Z][a-z]*)*$/

const consola = createConsola({ level: 3 })

const nominatimUrlRe = /https:\/\/nominatim.openstreetmap.org\/ui\/details.html\?osmtype=[RWN]&osmid=\d+&class=(boundary|place)/

const requestSchema = z.object({
  // CamelCase with underscores
  city: z.string().regex(cityRe, '`city` must be in CamelCase with underscores'),
  nominatimUrl: z.string().url().regex(nominatimUrlRe, 'Use URL from https://nominatim.openstreetmap.org/ui/search.html').optional(),
  geoJson: z.object({
    type: z.literal('FeatureCollection'),
    features: z.array(z.object({
      type: z.literal('Feature'),
      geometry: z.object({
        type: z.literal('Polygon'),
        coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
      }),
      properties: z.object({}).optional(),
    })),
  }).optional(),
}).refine(data => data.nominatimUrl || data.geoJson, {
  message: 'Either `nominatimUrl` (from https://nominatim.openstreetmap.org/ui/search.html) or `geoJson` must be provided',
})

export default defineEventHandler(async (event) => {
  const params = await readValidatedBody(event, body => requestSchema.parse(body))

  const client = await serverSupabaseClient<Database>(event)
  const { data: city } = await client.from('cryptocities').select('id,shape').eq('name', params.city)
  if (!city || city?.length === 0) {
    return createError({ message: `City ${params.city} not found`, status: 404 })
  }

  consola.info(`Merging city ${params.city}`)

  const { supabaseAdminEmail: email, supabaseAdminPassword: password } = useRuntimeConfig()
  await client.auth.signInWithPassword({ email, password })
  consola.debug('Signed in as admin')

  let features: FeatureCollection<Polygon> = featureCollection([feature(city[0].shape as Polygon)])

  // Handle the geoJson or nominatimUrl input
  if (params.geoJson) {
    features.features.push(...params.geoJson.features as Feature<Polygon>[])
  }
  else if (params.nominatimUrl) {
    // Parse the URL to extract the parameters
    const urlParts = params.nominatimUrl.split('/')
    const osmType = urlParts[6][0]
    const osmId = urlParts[6].slice(1)
    const osmClass = urlParts[7]

    // Fetch the GeoJSON data from the OSM API
    const { data: fetchedGeoJson, error: geojsonError } = await getGeoJson({ osmClass, osmId, osmType })
    if (geojsonError)
      return createError({ message: geojsonError, status: 500 })
    features = featureCollection([fetchedGeoJson])
  }
  else {
    return createError({ message: 'Invalid input: no valid geoJson or nominatimUrl provided', status: 400 })
  }

  const mergedGeoJson = union(features)
  if (!mergedGeoJson)
    return createError({ message: 'Failed to merge GeoJSON data', status: 500 })

  // Update the city's GeoJSON shape in the database
  const { error: errUpdatingPolygon } = await client.from('cryptocities').update({ shape: mergedGeoJson.geometry }).eq('name', params.city)
  if (errUpdatingPolygon)
    return createError({ message: `Failed to update data: ${errUpdatingPolygon.message}`, status: 500 })

  return mergedGeoJson
})
