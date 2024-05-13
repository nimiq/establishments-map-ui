import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
// import { checker } from 'vite-plugin-checker'
import VueDevTools from 'vite-plugin-vue-devtools'

// @ts-expect-error webpack-i18n-tools does currently not expose types
import poLoader from 'webpack-i18n-tools/loader/rollup'

// @ts-expect-error webpack-i18n-tools does currently not expose types
import poOptimizer from 'webpack-i18n-tools/optimizer/rollup'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
// @ts-expect-error RadixVueResolver does currently not expose types
import RadixVueResolver from 'radix-vue/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    poLoader(),
    poOptimizer(),
    vue({ script: { defineModel: true } }),
    VueDevTools(),
    // checker({ vueTsc: true, typescript: true }), // Waiting for https://github.com/fi3ework/vite-plugin-checker/issues/306#issuecomment-1995606874
    UnoCSS(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'pinia',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          '@vueuse/router': ['useRouteQuery'],
        },
        {
          from: 'types',
          imports: ['MapLocation', 'Cluster', 'Cryptocity', 'CryptocityData', 'Currency', 'Provider'],
          type: true,
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
        'src/i18n',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/components.d.ts',
      resolvers: [
        RadixVueResolver(),
        {
          type: 'component',
          resolve(name: string) {
            const vueGoogleMap = ['GoogleMap', 'CustomMarker']
            if (vueGoogleMap.includes(name)) {
              return { name, from: 'vue3-google-map' }
            }
          }
        }
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
})
