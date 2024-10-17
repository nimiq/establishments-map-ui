import { safeParse } from 'valibot'
import type { Database } from '~~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'
import type { MapLocation } from '~~/types/location'
import { UuidObjectSchema } from '~~/lib/schemas'
import { cacheLocation, getLocationKey } from '~~/server/utils/cache-location'

export default defineEventHandler(async (event) => {
  // Validate the route parameters
  const { output: query, issues, success } = await getValidatedRouterParams(event, query => safeParse(UuidObjectSchema, query))
  if (!success || !query)
    throw createError({ statusCode: 400, message: 'Invalid path parameters', cause: JSON.stringify(issues) })

  // Generate a unique key for the location
  const key = getLocationKey(query.uuid)
  const kv = hubKV()

  // Check if the location data is already cached in KV store
  if (await kv.has(key))
    return await kv.get(key)

  // If not in cache, fetch the location data from Supabase
  const supabase = await serverSupabaseClient<Database>(event)
  const { data: location, error } = await supabase.rpc('get_location_by_uuid', { location_uuid: query.uuid }) as unknown as { data: MapLocation, error: any }
  if (error || !location)
    return createError({ statusCode: 404, message: `Location with UUID ${query.uuid} not found` })

  await cacheLocation(event, location)
  return location
})
