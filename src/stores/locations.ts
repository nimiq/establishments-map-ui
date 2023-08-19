import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import { type BoundingBox, type Location, getLocations as getDbLocations, getLocation } from '@/database'

export const useLocations = defineStore('locations', () => {
  // const appStore = useApp()
  // const { selectedCategories, selectedCurrencies } = storeToRefs(appStore)

  const locationsMap = reactive(new Map<string, Location>())
  const locations = computed(() => [...locationsMap.values()])
  // const locationsInView = computed(() => Array.from(locations.value.values()).filter(e => includeLocation(e, boundingBox.value)))

  async function getLocations(boundingBox: BoundingBox) {
    const newLocations = await getDbLocations(boundingBox)
    newLocations.forEach(newLocation => locationsMap.set(newLocation.uuid, newLocation))
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

  // function includeLocation({ lat, lng, category, accepts, sells }: Location, boundingBox?: BoundingBox) {
  //   if (!boundingBox)
  //     return true
  //   const { northEast: ne, southWest: sw } = boundingBox

  //   const insideBoundingBox = lat <= ne.lat && lat >= sw.lat && lng <= ne.lng && lng >= sw.lng
  //   if (!insideBoundingBox)
  //     return false

  //   const currencies = accepts.concat(sells)
  //   const isFilteredByCurrencies = selectedCurrencies.value.length === 0 || currencies.some(c => selectedCurrencies.value.includes(c))
  //   const isFilteredByCategories = selectedCategories.value.length === 0 || selectedCategories.value.includes(category)
  //   return isFilteredByCurrencies && isFilteredByCategories
  // }

  return {
    getLocations,
    getLocationByUuid,

    locationsMap,
    locations,
    // locationsInView,
  }
})
