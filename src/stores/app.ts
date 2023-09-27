import { defineStore, storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useMarkers } from '@/stores/markers'

export const useApp = defineStore('app', () => {
  // We just track the first load, so we can show a loading indicator
  const isListShown = ref(false)
  const mapLoaded = ref(false)

  const { loaded: markersLoaded } = storeToRefs(useMarkers())

  const until = Date.now() + 200 // Show the splash screen at least for 300ms
  const showSplashScreen = ref(true)
  watch([mapLoaded, markersLoaded], () => {
    if (mapLoaded.value && markersLoaded.value)
      setTimeout(() => showSplashScreen.value = false, Math.max(0, until - Date.now()))
  })

  // We track if the user has hidden the search box hint using localStorage
  const shouldShowSearchBoxHint = ref(!localStorage.getItem('hideSearchBoxHint'))
  document.documentElement.style.setProperty('--search-box-hint', shouldShowSearchBoxHint.value ? '1' : '0')
  const hideSearchBoxHint = () => {
    localStorage.setItem('hideSearchBoxHint', 'true')
    shouldShowSearchBoxHint.value = false
    document.documentElement.style.setProperty('--search-box-hint', '0')
  }

  return {
    isListShown,
    shouldShowSearchBoxHint,
    hideSearchBoxHint,
    mapLoaded,
    showSplashScreen,
  }
})
