import { getTimestamps } from 'database'
import type { AnyUserReadDbFunction, Returns } from 'types'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useApp = defineStore('app', () => {
  // We just track the first load, so we can show a loading indicator
  const isListShown = ref(false)

  // Allow to change the language from the URI. Useful for iframe embeds
  // const lang = useRouteQuery<string>('lang')
  // const { setLanguage } = useTranslations()
  // watch(lang, setLanguage, { immediate: true })

  const route = useRoute()

  const { mapLoaded } = storeToRefs(useMap())
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

  // The timestamps are used to invalidate the local storage values
  const timestamps = ref<Returns[AnyUserReadDbFunction.GetTimestamps]>()

  const { init: initCaptcha, captchaTokenUuid } = useCaptcha()
  async function init() {
    const promises = []
    if (!captchaTokenUuid.value)
      promises.push(initCaptcha())

    if (!timestamps.value) {
      const { databaseKey, databaseUrl } = useRuntimeConfig().public
      const auth = { url: databaseUrl, apikey: databaseKey }
      promises.push(getTimestamps(auth).then(newTimestamps => timestamps.value = newTimestamps))
    }

    await Promise.all(promises)
  }

  init()

  return {
    isListShown,
    showSplashScreen,
    timestamps,
    init,
    captchaTokenUuid,
  }
})
