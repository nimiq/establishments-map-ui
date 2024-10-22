import type { Database } from '~~/types/supabase'
import { createClient } from '@supabase/supabase-js'

export default defineTask({
  meta: {
    name: 'clustering',
    description: 'Run markers clustering',
  },
  run: async () => {
    const { url, key } = useRuntimeConfig().public.supabase
    const client = createClient<Database>(url, key)
    // const client = await serverSupabaseClient<Database>() - Currently supabase nuxt server composable requires auth
    // https://github.com/nuxt-modules/supabase/issues/388

    await clustering(client)
    return { result: true }
  },
})
