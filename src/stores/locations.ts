import { defineStore, storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { getLocations as getDbLocations, getLocation } from '@/database'
import type { BoundingBox, Location } from '@/types'
import { useApp } from '@/stores/app'

export const useLocations = defineStore('locations', () => {
  // We just track the first load, so we can show a loading indicator
  const loaded = ref(false)

  const currentBoundingBox = ref<BoundingBox>()

  /*
    Reduce redundant database fetches by reusing fetched locations by:
      - `memoizedLocations` stores fetched bounding boxes without considering zoom levels.
      - Before fetching, we check if the current bounding box is within a larger fetched bounding box.
      - If so, the fetch is skipped; otherwise, a new fetch occurs and `memoizedLocations` is updated.
  */
  const memoizedLocations = ref<BoundingBox[]>([])
  const locationsMap = reactive(new Map<string, Location>())
  const locations = computed(() => {
    if (!currentBoundingBox.value)
      return []
    const { neLat, neLng, swLat, swLng } = currentBoundingBox.value
    return [...locationsMap.values()].filter((location) => {
      const { lat, lng } = location
      const isWithinBoundingBox = lat <= neLat && lng <= neLng && lat >= swLat && lng >= swLng
      return isWithinBoundingBox && includeLocation(location)
    })
  })

  async function getLocations(boundingBox: BoundingBox) {
    currentBoundingBox.value = boundingBox

    // Check if the current bounding box is within an already fetched bounding box
    for (const { neLat, neLng, swLat, swLng } of memoizedLocations.value) {
      if (boundingBox.neLat <= neLat && boundingBox.neLng <= neLng && boundingBox.swLat >= swLat && boundingBox.swLng >= swLng)
        return
    }

    const newLocations = await getDbLocations(boundingBox)
    newLocations.forEach(newLocation => locationsMap.set(newLocation.uuid, newLocation))

    // Update memoizedLocations
    memoizedLocations.value.push(boundingBox)
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

  const selectedLocationUuid = ref<string>()
  function setSelectedLocationUuid(uuid?: string) {
    selectedLocationUuid.value = uuid
  }

  return {
    loaded,
    getLocations,
    getLocationByUuid,
    locations,

    selectedLocationUuid,
    setSelectedLocationUuid,
  }
})
