import type { Markers } from '~~/types/map'
import type { Database } from '~~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'
import { BoundingBoxSchema, ZoomSchema } from '~~/lib/schemas'
import { intersect, object, safeParse } from 'valibot'

// TODO Rename zoom_level
const Schema = intersect([BoundingBoxSchema, object({ zoom_level: ZoomSchema })])

export default defineEventHandler(async (event) => {
  // Validate the route parameters
  const { output: query, issues, success } = await getValidatedQuery(event, query => safeParse(Schema, query))
  if (!success || !query)
    throw createError({ statusCode: 400, message: 'Invalid query parameters', cause: JSON.stringify(issues) })

  // Fetch the pre-computed markers from Supabase
  const supabase = await serverSupabaseClient<Database>(event)
  const { data, error } = await supabase.rpc('get_markers', query) as unknown as { data: Markers, error: any }
  if (error || !data)
    return createError({ statusCode: 404, message: `No markers found` })

  // event.waitUntil(Promise.all(data.singles.map(l => cacheLocation(event, l))))

  return data
})
