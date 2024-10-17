import { env } from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    typedPages: true,
    inlineRouteRules: true,
  },

  build: {
    transpile: [/unplugin-vue-router\/runtime/],
  },

  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@unocss/nuxt', '@nuxt/eslint', 'radix-vue/nuxt', '@nuxtjs/supabase', '@nuxthub/core', '@nuxt/fonts'],

  hub: {
    kv: true,
    blob: true,
  },

  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    supabaseUrl: env.SUPABASE_URL,
    supabaseKey: env.SUPABASE_KEY,
    supabaseAdminEmail: env.SUPABASE_ADMIN_EMAIL,
    supabaseAdminPassword: env.SUPABASE_ADMIN_PASSWORD,

    public: {
      googleMapsApiKey: env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      slackNewCandidateUrl: env.NUXT_PUBLIC_SLACK_NEW_CANDIDATE_URL,
      slackReportUrl: env.NUXT_PUBLIC_SLACK_REPORT_URL,
      // recaptcha: {
      //   v3SiteKey: process.env.NUXT_RECAPTCHA_SITE_KEY,
      // }
    },
  },

  imports: {
    imports: [
      ...['Currency', 'Provider', 'Providers', 'Category', 'Categories'].map(name => ({ name, from: '~~/types/database.ts' })),
      ...['bBoxIsWithinArea', 'getItemsWithinBBox', 'addBBoxToArea'].map(name => ({ name, from: '~~/lib/geo-json.ts' })),
      ...['Issue'].map(name => ({ name, from: '~~/types/issue.ts', declarationType: true })),
      ...['CurrencyType', 'CurrencyTypeNoBNC', 'ProviderType', 'CategoryType'].map(name => ({ name, from: '~~/types/database.ts', type: true })),
      ...['LocationLink', 'Theme', 'LocationType'].map(name => ({ name, from: '~~/types/location.ts' })),
      ...['MapLocation', 'LocationBanner', 'CardType', 'LocationLinkType'].map(name => ({ name, from: '~~/types/location.ts', type: true })),
      ...['Cryptocity'].map(name => ({ name, from: '~~/types/cryptocity.ts' })),
      ...['CryptocityData', 'CryptocityType', 'CryptocityDatabase', 'CryptocityUI'].map(name => ({ name, from: '~~/types/cryptocity.ts', type: true })),
      ...['BoundingBox', 'Cluster', 'MapPosition', 'ClusterArea', 'Point', 'LocationClusterParams', 'EstimatedMapPosition'].map(name => ({ name, from: '~~/types/map.ts', type: true })),
    ],
  },

  vite: {
    plugins: [
      // poLoader(),
      // poOptimizer(),
    ],
  },

  routeRules: {
    '/api/locations/**': { cors: true },
    '/api/markers/**': { cors: true },
    '/images/**': { cors: true },
  },

  ignore: ['./bot'],

  eslint: {
    config: {
      standalone: false,
    },
  },

  compatibilityDate: '2024-07-17',
})
