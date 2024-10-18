import type { MapLocation } from '~~/types/location'
import type { Database } from '~~/types/supabase'
import type { H3Event } from 'h3'
import type { InferInput } from 'valibot'
import { serverSupabaseClient } from '#supabase/server'
import { safeParse } from 'valibot'
import { BoundingBoxSchema } from '../../../lib/schemas'

export default defineEventHandler(async (event: H3Event<{ query: InferInput<typeof BoundingBoxSchema> }>) => {
  // Validate the route parameters
  const { output: query, issues, success } = await getValidatedQuery(event, query => safeParse(BoundingBoxSchema, query))
  if (!success || !query)
    throw createError({ statusCode: 400, message: 'Invalid path parameters', cause: JSON.stringify(issues) })

  // If not in cache, fetch the location data from Supabase
  const supabase = await serverSupabaseClient<Database>(event)
  const { data: locations, error } = await supabase.rpc('get_locations', { ...query, page_size: 120 }) as unknown as { data: MapLocation[], error: any }
  if (error || !locations)
    return createError({ statusCode: 404, message: `Locations not found` })

  return locations
})
