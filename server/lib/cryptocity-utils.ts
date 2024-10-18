import type { Result } from '~~/types/util'
import { consola } from 'consola'

export const cryptocityRegex = /^[A-Z][a-z]*(?:_[A-Z][a-z]*)*$/

interface GetOsmDetailsOptions {
  city: string
  countryCode: string
}

interface GetOsmDetailsResult {
  osmId: string
  osmClass: string
  osmType: string
}

export async function getOsmDetails({ city, countryCode }: GetOsmDetailsOptions): Result<Required<GetOsmDetailsResult>> {
  const urlPlace = new URL('http://nominatim.openstreetmap.org/search')
  urlPlace.searchParams.append('city', city.replaceAll('_', ' '))
  urlPlace.searchParams.append('countrycodes', countryCode.toLocaleLowerCase())
  urlPlace.searchParams.append('format', 'json')
  urlPlace.searchParams.append('limit', '1')

  consola.info(`Searching OSM details for ${city}, ${countryCode}: ${urlPlace.href}`)
  const responsePlace = await fetch(urlPlace)
  if (!responsePlace.ok)
    return { error: `Failed to fetch GeoJSON data: ${responsePlace.statusText}`, data: undefined }

  const dataPlace = await responsePlace.json()
  if (dataPlace.length === 0)
    return { error: 'No GeoJSON found for this city', data: undefined }

  const place = dataPlace[0]
  const osmId = place.osm_id
  const osmType = place.osm_type
  const osmClass = place.class

  if (osmType !== 'relation' || osmClass !== 'boundary')
    return { error: `No GeoJSON found for this city. We need type=relation and class=boundary. We got ${JSON.stringify(place)}`, data: undefined }

  return { data: { osmId, osmType, osmClass }, error: undefined }
}

export type GetGeoGeoJsonOptions = GetOsmDetailsResult

export async function getGeoJson({ osmId, osmClass, osmType }: GetGeoGeoJsonOptions) {
  const urlGeoJson = new URL('http://nominatim.openstreetmap.org/details')
  urlGeoJson.searchParams.append('osmid', osmId.trim())
  urlGeoJson.searchParams.append('osmtype', osmType.trim())
  urlGeoJson.searchParams.append('class', osmClass.trim())

  urlGeoJson.searchParams.append('format', 'json')
  urlGeoJson.searchParams.append('polygon_geojson', '1')

  consola.info(`Fetching GeoJSON ${urlGeoJson.href}`)
  const responseGeoJson = await fetch(urlGeoJson)
  if (!responseGeoJson.ok)
    return { error: `Failed to fetch GeoJSON data: ${responseGeoJson.statusText} ${responseGeoJson.status} ${JSON.stringify(await responseGeoJson.json())}`, data: undefined }

  const dataGeoJson = await responseGeoJson.json()
  return { data: dataGeoJson.geometry, error: undefined }
}
