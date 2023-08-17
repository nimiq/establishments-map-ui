import process from 'node:process'
import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [
    HstVue(),
  ],
  setupFile: '/src/histoire-setup.ts',
  vite: {
    base: process.env.HISTOIRE_BASE || '/',
  },
})
