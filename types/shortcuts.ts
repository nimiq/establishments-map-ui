import type { Database } from './supabase'

export type MapLocation = Database['public']['Functions']['get_locations']['Returns'][number]
