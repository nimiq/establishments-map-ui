import process from 'node:process'
import { createI18n } from 'vue-i18n'
import { Cookie } from '@nimiq/utils'

// import { setLanguage as setVueComponentsLanguage } from '@nimiq/vue3-components'

const DEFAULT_LANGUAGE = 'en'
export const SUPPORTED_LANGUAGES = ['de', 'en', 'es', 'fr', 'nl', 'tr', 'uk']
const loadedLanguages: string[] = []

export const i18nRegistration = createI18n({
  locale: DEFAULT_LANGUAGE, // set locale (2 letters format: 'en')
  fallbackLocale: DEFAULT_LANGUAGE, // fallback locale if no translation found
  silentTranslationWarn: true, // disable the "no translation found" warning
})
export const i18n = i18nRegistration.global

if (process.env.NODE_ENV === 'production')
  i18n.missing = () => '' // trick to not show numbers instead of string before language is loaded

// load and set language
export async function setLanguage(lang: string): Promise<string> {
  if (!SUPPORTED_LANGUAGES.includes(lang))
    lang = DEFAULT_LANGUAGE

  // setVueComponentsLanguage(lang);

  if (!loadedLanguages.includes(lang)) {
    // For dynamic filename `${lang}.po` specify our folder to please @rollup/plugin-dynamic-import-vars.
    const messages = await import(`../i18n/${lang}.po`).then(module => module.default)
    i18n.setLocaleMessage(lang, messages)
    loadedLanguages.push(lang)
  }

  Cookie.setCookie('lang', lang, { samesite: 'lax' })
  i18n.locale = lang
  document.documentElement.setAttribute('lang', lang)
  return lang
}

// Return the language stored in the `lang` cookie. Fallback to the browser language
export function detectLanguage(): string {
  const langCookie = Cookie.getCookie('lang')
  const fallbackLang = window.navigator.language.split('-')[0]

  let lang = langCookie || fallbackLang
  // If the language is not supported set it to the default one
  if (!SUPPORTED_LANGUAGES.includes(lang))
    lang = DEFAULT_LANGUAGE

  return lang
}

// If the user changed the language in another window/tab then load and enable new language
function onTabFocus() {
  const lang = detectLanguage()
  if (i18n.locale !== lang)
    setLanguage(lang)
}

window.addEventListener('focus', onTabFocus)
