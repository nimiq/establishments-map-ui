import { createPinia } from 'pinia'
import { createApp, markRaw } from 'vue'
import App from './App.vue'
import { detectLanguage, i18nRegistration, setLanguage } from './i18n/i18n-setup'
import './style.css'
import 'virtual:uno.css'

import { router } from './router'

// load and set the initial language
setLanguage(detectLanguage())

const app = createApp(App)
app.use(router)

const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})
app.use(pinia)
app.use(i18nRegistration)

app.mount('#app')
