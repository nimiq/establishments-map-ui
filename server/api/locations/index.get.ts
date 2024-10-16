import { safeParse } from 'valibot'
import { BoundingBoxSchema } from '../../utils/schemas'
import type { Database } from '~~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'
import type { MapLocation } from '~~/types/location'
import { cacheLocation } from '~~/server/utils/cache-location'

export default defineEventHandler(async (event) => {
  // Validate the route parameters
  const { output: query, issues, success } = await getValidatedRouterParams(event, query => safeParse(BoundingBoxSchema, query))
  if (!success || !query)
    throw createError({ statusCode: 400, message: 'Invalid path parameters', cause: JSON.stringify(issues) })

  // If not in cache, fetch the location data from Supabase
  const supabase = await serverSupabaseClient<Database>(event)
  const { data: locations, error } = await supabase.rpc('get_locations', { ...query, page_size: 120 }) as unknown as { data: MapLocation[], error: any }
  if (error || !locations)
    return createError({ statusCode: 404, message: `Locations not found` })

  await Promise.all(locations.map(l => cacheLocation(event, l)))
  return location
})
