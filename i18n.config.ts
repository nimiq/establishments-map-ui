export const DEFAULT_LANGUAGE = 'en'
export const SUPPORTED_LANGUAGES = ['de', 'en', 'es', 'pt', 'nl', 'tr', 'uk', 'fr']
export const languagesLoaded = new Set<string>([DEFAULT_LANGUAGE])

// export default defineI18nConfig(async () => ({
//   locale: DEFAULT_LANGUAGE,
//   fallbackLocale: DEFAULT_LANGUAGE,
//   silentTranslationWarn: true,
//   // globalInjection: true,
//   legacy: true,
//   messages: DEFAULT_LANGUAGE ? await import(`@/assets/i18n/${DEFAULT_LANGUAGE}.po`).then(module => module.default) : {},

//   // trick to not show numbers instead of string before language is loaded
//   missing: !import.meta.dev ? (_locale, key) => /^[0-9]+$/.test(key) ? '' : key : undefined,  
// }))

