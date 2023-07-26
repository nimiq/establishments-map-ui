import './index.css'
import { defineSetupVue3 } from '@histoire/plugin-vue'
import { createPinia } from 'pinia'
import { router } from "./router";
import { messages } from "./locales";
import { createI18n } from 'vue-i18n';

const languageUser = navigator.language;
export const i18n = createI18n<false>({
  locale: languageUser,
  fallbackLocale: "en",
  messages,
})

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(createPinia())
  app.use(router)
  app.use(i18n);
})
