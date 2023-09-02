import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, shallowReactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRouteQuery } from '@vueuse/router'
import { useMap } from './map'
import { getLocations as getDbLocations, getLocation } from '@/database'
import type { BoundingBox, Location } from '@/types'
import { useFilters } from '@/stores/filters'

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
  const memoizedLocations: BoundingBox[] = []
  const locationsMap = shallowReactive(new Map<string, Location>())
  const locations = computed(() => {
    if (!currentBoundingBox.value)
      return []
    return [...locationsMap.values()].filter(location => includeLocation(location, currentBoundingBox.value!))
  })

  async function getLocations(boundingBox: BoundingBox) {
    currentBoundingBox.value = boundingBox

    // Check if the current bounding box is within an already fetched bounding box
    for (const { neLat, neLng, swLat, swLng } of memoizedLocations) {
      if (boundingBox.neLat <= neLat && boundingBox.neLng <= neLng && boundingBox.swLat >= swLat && boundingBox.swLng >= swLng)
        return
    }

    const newLocations = await getDbLocations(boundingBox)
    newLocations.forEach(newLocation => locationsMap.set(newLocation.uuid, newLocation))

    // Update memoizedLocations
    memoizedLocations.push(boundingBox)
    loaded.value = true
  }

  async function getLocationByUuid(uuid: string) {
    if (locationsMap.has(uuid))
      return locationsMap.get(uuid)
    const location = await getLocation(uuid)
    if (!location)
      return
    locationsMap.set(uuid, location)
    return location
  }

  const { selectedCurrencies, selectedCategories } = storeToRefs(useFilters())

  function includeLocation({ category, accepts, sells, lat, lng }: Location, { neLat, neLng, swLat, swLng }: BoundingBox) {
    const isWithinBoundingBox = neLng > swLng
      ? lat <= neLat && lng <= neLng && lat >= swLat && lng >= swLng
      : lat <= neLat && (lng <= neLng || lng >= swLng) && lat >= swLat // Consider anti-meridian

    const currencies = accepts.concat(sells)
    const isFilteredByCurrencies = selectedCurrencies.value.length === 0 || currencies.some(c => selectedCurrencies.value.includes(c))
    const isFilteredByCategories = selectedCategories.value.length === 0 || selectedCategories.value.includes(category)
    return isWithinBoundingBox && isFilteredByCurrencies && isFilteredByCategories
  }

  const router = useRouter()
  const route = useRoute()

  const selectedUuid = useRouteQuery<string | undefined>('uuid') // No need to check for string[]. UUID checked in router.ts
  watch(() => selectedUuid.value, (newUuid) => {
    if (newUuid)
      router.push({ query: { uuid: newUuid, ...route.query } })
  })

  async function goToLocation(uuid: string) {
    const location = await useLocations().getLocationByUuid(uuid)
    if (!location)
      return false

    useMap().setPosition({
      center: { lat: location.lat, lng: location.lng },
      zoom: 19,
    })

    return true
  }

  return {
    loaded,
    getLocations,
    getLocationByUuid,
    locations,

    selectedUuid,
    goToLocation,
  }
})
