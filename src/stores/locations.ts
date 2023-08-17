import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useApp } from './app'
import { type BoundingBox, useMap } from './map'
import { type Location, getLocation, getLocations } from '@/database'

export const useLocations = defineStore('Locations', () => {
  const appStore = useApp()
  const { selectedCategories, selectedCurrencies } = storeToRefs(appStore)

  const mapStore = useMap()
  const { boundingBox } = storeToRefs(mapStore)

  const locations = ref(new Map<string, Location>())
  const locationsInView = computed(() => Array.from(locations.value.values()).filter(e => includeLocation(e, boundingBox.value)))

  watch(() => boundingBox, async () => {
    const fetchedLocations = await getLocations(boundingBox.value)
    fetchedLocations.forEach((location) => {
      if (!locations.value.has(location.uuid))
        locations.value.set(location.uuid, location)
    })
  })

  async function getLocationByUuid(uuid: string) {
    if (!locations.value.has(uuid))
      return locations.value.get(uuid)

    const location = await getLocation(uuid)
    if (!location)
      return
    locations.value.set(uuid, location)
    return location
  }

  function includeLocation({ lat, lng, category, cryptos_accepted, cryptos_available }: Location, { northEast: ne, southWest: sw }: BoundingBox) {
    const insideBoundingBox = lat <= ne.lat && lat >= sw.lat && lng <= ne.lng && lng >= sw.lng
    if (!insideBoundingBox)
      return false

    const currencies = cryptos_accepted.concat(cryptos_available)
    const isFilteredByCurrencies = selectedCurrencies.value.length === 0 || currencies.some(c => selectedCurrencies.value.includes(c))
    const isFilteredByCategories = selectedCategories.value.length === 0 || selectedCategories.value.includes(category)
    return isFilteredByCurrencies && isFilteredByCategories
  }

  return {
    locations,
    locationsInView,
    getLocationByUuid,
  }
})
