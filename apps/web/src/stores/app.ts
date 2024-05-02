import { getTimestamps } from 'database'
import type { AnyUserReadDbFunction, Returns } from 'types'
import { DATABASE_ARGS } from '@/shared'
import { useRouteQuery } from '@vueuse/router'
import { setLanguage } from '@/i18n/i18n-setup'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useApp = defineStore('app', () => {
  // We just track the first load, so we can show a loading indicator
  const isListShown = ref(false)
  const mapLoaded = ref(false)

  // Allow to change the language from the URI. Useful for iframe embeds
  const lang = useRouteQuery<string>('lang')
  watch(lang, setLanguage, { immediate: true })

  const route = useRoute()

  const { loaded: markersLoaded } = storeToRefs(useMarkers())

  const until = Date.now() + 300 // Show the splash screen at least for 300ms
  const showSplashScreen = ref(true)
  watch([mapLoaded, markersLoaded], () => {
    if (mapLoaded.value && markersLoaded.value) {
      setTimeout(() => {
        showSplashScreen.value = false

        // FIXME It would be better to use another method to open the location card
        // Open location card if UUID is in the URL
        if (route.query.uuid)
          sleep(1000).then(() => (document.querySelector(`[data-trigger-uuid="${route.query.uuid}"]`) as HTMLElement)?.click())
      }, Math.max(0, until - Date.now()))
    }
  })

  // We track if the user has hidden the search box hint using localStorage
  const shouldShowSearchBoxHint = ref(!localStorage.getItem('hideSearchBoxHint'))
  document.documentElement.style.setProperty('--search-box-hint', shouldShowSearchBoxHint.value ? '1' : '0')
  function hideSearchBoxHint() {
    localStorage.setItem('hideSearchBoxHint', 'true')
    shouldShowSearchBoxHint.value = false
    document.documentElement.style.setProperty('--search-box-hint', '0')
  }

  // The timestamps are used to invalidate the local storage values
  const timestamps = ref<Returns[AnyUserReadDbFunction.GetTimestamps]>()

  const { init: initCaptcha, captchaTokenUuid } = useCaptcha()
  async function init() {
    const promises = []
    if (!captchaTokenUuid.value)
      promises.push(initCaptcha())

    if (!timestamps.value)
      promises.push(getTimestamps(DATABASE_ARGS).then(newTimestamps => timestamps.value = newTimestamps))

    await Promise.all(promises)
  }

  init()

  return {
    isListShown,
    shouldShowSearchBoxHint,
    hideSearchBoxHint,
    mapLoaded,
    showSplashScreen,
    timestamps,
    init,
    captchaTokenUuid,
  }
})
