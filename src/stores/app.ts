import { defineStore, storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { watchOnce } from '@vueuse/core'
import { useCluster } from './cluster'

export const useApp = defineStore('app', () => {
  // We just track the first load, so we can show a loading indicator
  const firstLocationsLoaded = ref(false)
  const isListShown = ref(false)
  const mapLoaded = ref(false)

  const until = Date.now() + 200 // Show the splash screen at least for 300ms
  const showSplashScreen = ref(true)
  watch([mapLoaded, firstLocationsLoaded], () => {
    if (mapLoaded.value && firstLocationsLoaded.value)
      setTimeout(() => showSplashScreen.value = false, Math.max(0, until - Date.now()))
  })

  const { singles, clusters } = storeToRefs(useCluster())

  // The moment any of these two stores are loaded, we set the firstLocationsLoaded to true
  watchOnce([singles, clusters], () => firstLocationsLoaded.value = true)

  // We track if the user has hidden the search box hint using localStorage
  const shouldShowSearchBoxHint = ref(!localStorage.getItem('hideSearchBoxHint'))
  document.documentElement.style.setProperty('--search-box-hint', shouldShowSearchBoxHint.value ? '1' : '0')
  const hideSearchBoxHint = () => {
    localStorage.setItem('hideSearchBoxHint', 'true')
    shouldShowSearchBoxHint.value = false
    document.documentElement.style.setProperty('--search-box-hint', '0')
  }

  return {
    firstLocationsLoaded,
    isListShown,
    shouldShowSearchBoxHint,
    hideSearchBoxHint,
    mapLoaded,
    showSplashScreen,
  }
})
