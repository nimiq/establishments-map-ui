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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    poLoader(),
    poOptimizer(),
    vue({ script: { defineModel: true } }),
    VueDevTools(),
    // checker({ vueTsc: true, typescript: true }), // Waiting for https://github.com/fi3ework/vite-plugin-checker/issues/306#issuecomment-1995606874
    UnoCSS(),
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
