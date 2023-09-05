import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import { useLocations } from './locations'
import { useCluster } from './cluster'

export const useApp = defineStore('app', () => {
  // We just track the first load, so we can show a loading indicator
  const firstLocationsLoaded = ref(false)

  const { locations } = storeToRefs(useLocations())
  const { clusters } = storeToRefs(useCluster())

  // The moment any of these two stores are loaded, we set the firstLocationsLoaded to true
  watchOnce([locations, clusters], () => firstLocationsLoaded.value = true)

  return {
    firstLocationsLoaded,
  }
})
