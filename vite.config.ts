import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pluginRewriteAll from 'vite-plugin-rewrite-all'

// @ts-expect-error webpack-i18n-tools does currently not expose types
import poLoader from 'webpack-i18n-tools/loader/rollup'

// @ts-expect-error webpack-i18n-tools does currently not expose types
import poOptimizer from 'webpack-i18n-tools/optimizer/rollup'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    pluginRewriteAll(), // Allow have dots in the path for the coords like /@1.23,14.567,12z
    poLoader(),
    poOptimizer(),
    vue({
      reactivityTransform: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
})
