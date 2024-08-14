import { z } from 'zod'
import { serverSupabaseClient } from '#supabase/server'
import { createConsola } from 'consola'
import { Database } from '~~/types/supabase'

const city = /^[A-Z][a-z]*(?:_[A-Z][a-z]*)*$/

const consola = createConsola({ level: 3 })

const requestSchema = z.object({
  countryCode: z.string(),
  // CamelCase with underscores 
  city: z.string().regex(city, '`city` must be in CamelCase with underscores'),
})

type Result<T> =
    | { data: T, error?: string }
    | { data: undefined, error: string }

async function getCityGeojson({ city, countryCode }: typeof requestSchema._type): Promise<Result<any>> {
  const urlPlace = new URL('http://nominatim.openstreetmap.org/search')
  urlPlace.searchParams.append('city', city.replaceAll('_', ' '))
  urlPlace.searchParams.append('countrycodes', countryCode.toLocaleLowerCase())
  urlPlace.searchParams.append('format', 'json')
  urlPlace.searchParams.append('limit', '1')
  consola.info(`Searching data for ${city}, ${countryCode}: ${urlPlace.href}`)
  const responsePlace = await fetch(urlPlace)
  if (!responsePlace.ok) return { error:`Failed to fetch GeoJSON data: ${responsePlace.statusText}`, data: undefined }

  const dataPlace = await responsePlace.json()
  if (dataPlace.length === 0) return { error: 'No GeoJSON found for this city', data: undefined }
  
  const place = dataPlace[0];
  const osmId = place.osm_id;
  const osmType = place.osm_type;
  const osmClass = place.class;
  const osmPlaceId = place.place_id;

  if (osmType !== 'relation' || osmClass !== 'boundary')
    return { error: `No GeoJSON found for this city. We need type=relation and class=boundary. We got ${JSON.stringify(place)}`, data: undefined }

  // We need to wait a bit before fetching the GeoJSON
    await new Promise(resolve => setTimeout(resolve, 2_500))

const urlGeoJson = new URL('http://nominatim.openstreetmap.org/details')
urlGeoJson.searchParams.append('osmid', osmId)
urlGeoJson.searchParams.append('osmtype', osmType)
urlGeoJson.searchParams.append('place_id', osmPlaceId)
urlGeoJson.searchParams.append('class', osmClass)
urlGeoJson.searchParams.append('format', 'json')
urlGeoJson.searchParams.append('polygon_geojson', '1')
consola.info(`Fetching GeoJSON for ${city}, ${countryCode}: ${urlGeoJson.href}`)

  const responseGeoJson = await fetch(urlGeoJson)
  if (!responseGeoJson.ok) return { error: `Failed to fetch GeoJSON data: ${responseGeoJson.statusText} ${responseGeoJson.status} ${JSON.stringify(await responseGeoJson.json())}`, data: undefined }

  const dataGeoJson = await responseGeoJson.json()
  console.log({dataGeoJson})
  return { data: dataGeoJson.geometry, error: undefined }
}

export default defineEventHandler(async (event) => {
  const params = await readValidatedBody(event, body => requestSchema.parse(body))

  consola.info(`Inserting city ${params.city} in ${params.countryCode}`)

  const client = await serverSupabaseClient<Database>(event)
  const { supabaseAdminEmail: email, supabaseAdminPassword: password } = useRuntimeConfig()
  await client.auth.signInWithPassword({ email, password })
  consola.debug('Signed in as admin')

  const { data: cityAlreadyInserted } = await client.from('cryptocities').select('id').eq('name', params.city)
  if (cityAlreadyInserted && cityAlreadyInserted?.length > 0) {
    const { error } = await client.from('cryptocities').delete().eq('name', params.city)
    if (error) {
      consola.error(`Failed to delete existing data for ${params.city}: ${error.message}`)
      return createError({ message: `Failed to delete data: ${error.message}`, status: 500 })
    }
  }

    const { data: geojson, error: geojsonError } = await getCityGeojson(params)
    if (geojsonError) {
        consola.error(geojsonError)
        return createError({ message: geojsonError, status: 500 })
    }

    const newCity = {
      name: params.city,
      shape: geojson,
    }
    const { data, error } = await client.from('cryptocities').insert(newCity)

  if (error) {  
    return createError({ message: `Failed to insert data: ${error.message}`, status: 500 })
  }

 return { message: `City ${params.city} inserted successfully`, data, newCity }
})