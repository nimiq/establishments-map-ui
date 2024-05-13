import { defineSetupVue3 } from '@histoire/plugin-vue'
import { createPinia } from 'pinia'
import { RecycleScroller } from 'vue-virtual-scroller'
import { detectLanguage, i18nRegistration, setLanguage } from './i18n/i18n-setup'
import './style.css'
import 'virtual:uno.css'
import { router } from './router'

// load and set the initial language
setLanguage(detectLanguage())

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(createPinia())
  app.use(router)
  app.use(i18nRegistration)
  app.component('RecycleScroller', RecycleScroller)
})

// This router navigation guard is to prevent switching to the new route before the language file finished loading.
// If there are any routes which do not require translations, they can be skipped here.
router.beforeResolve((to, from, next) => {
  setLanguage(detectLanguage()).then(() => next())
})
