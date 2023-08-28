import { defineStore, storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { getLocations as getDbLocations, getLocation } from '@/database'
import type { BoundingBox, Location } from '@/types'
import { useApp } from '@/stores/app'

export const useLocations = defineStore('locations', () => {
  // We just track the first load, so we can show a loading indicator
  const loaded = ref(false)

  const locationsMap = reactive(new Map<string, Location>())
  const locations = computed(() => [...locationsMap.values()].filter(includeLocation))

  async function getLocations(boundingBox: BoundingBox) {
    const newLocations = await getDbLocations(boundingBox)
    newLocations.forEach(newLocation => locationsMap.set(newLocation.uuid, newLocation))
    loaded.value = true
  }

  async function getLocationByUuid(uuid: string) {
    if (!locationsMap.has(uuid))
      return locationsMap.get(uuid)

    const location = await getLocation(uuid)
    if (!location)
      return
    locationsMap.set(uuid, location)
    return location
  }

  const { selectedCurrencies, selectedCategories } = storeToRefs(useApp())

  function includeLocation({ category, accepts, sells }: Location) {
    const currencies = accepts.concat(sells)
    const isFilteredByCurrencies = selectedCurrencies.value.length === 0 || currencies.some(c => selectedCurrencies.value.includes(c))
    const isFilteredByCategories = selectedCategories.value.length === 0 || selectedCategories.value.includes(category)
    return isFilteredByCurrencies && isFilteredByCategories
  }

  return {
    loaded,
    getLocations,
    getLocationByUuid,
    locations,
  }
})
