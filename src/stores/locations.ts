import { useRouteQuery } from '@vueuse/router'
import { getLocations as getDbLocations, getLocation } from 'database'
import { defineStore, storeToRefs } from 'pinia'
import { addBBoxToArea, bBoxIsWithinArea, getLocationsWithinBBox } from 'shared'
import type { BoundingBox, Location } from 'types'
import { computed, ref, shallowReactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MultiPolygon } from '@turf/turf'
import { useMap } from './map'
import { useFilters } from '@/stores/filters'
import { DATABASE_ARGS, parseLocation } from '@/shared'

export const useLocations = defineStore('locations', () => {
  const currentBoundingBox = ref<BoundingBox>()

  //  Reduce redundant database fetches by reusing fetched locations by tracking the areas explored by the user
  let visitedAreas: MultiPolygon

  const locationsMap = shallowReactive(new Map<string, Location>())

  const locations = computed(() => {
    if (!currentBoundingBox.value)
      return []
    const filteredLocations = [...locationsMap.values()].filter(location => includeLocation(location))
    // return getLocationsWithinBBox(filteredLocations, currentBoundingBox.value)
    return filteredLocations
  })

  function setLocations(locations: Location[]) {
    locations.forEach(location => locationsMap.set(location.uuid, location))
  }

  async function getLocations(boundingBox: BoundingBox): Promise<Location[]> {
    currentBoundingBox.value = boundingBox

    if (bBoxIsWithinArea(boundingBox, visitedAreas))
      return getLocationsWithinBBox(locations.value, boundingBox)

    const newLocations = await getDbLocations(DATABASE_ARGS, boundingBox, parseLocation)
    setLocations(newLocations)

    visitedAreas = addBBoxToArea(boundingBox, visitedAreas)

    return newLocations
  }

  async function getLocationByUuid(uuid: string) {
    if (locationsMap.has(uuid))
      return locationsMap.get(uuid)
    const location = await getLocation(DATABASE_ARGS, uuid, parseLocation)
    if (!location)
      return
    locationsMap.set(uuid, location)
    return location
  }

  const { selectedCurrencies, selectedCategories } = storeToRefs(useFilters())

  function includeLocation({ category, accepts, sells, lat, lng }: Location) {
    const currencies = accepts.concat(sells)
    const isFilteredByCurrencies = selectedCurrencies.value.length === 0 || currencies.some(c => selectedCurrencies.value.includes(c))
    const isFilteredByCategories = selectedCategories.value.length === 0 || selectedCategories.value.includes(category)
    return isFilteredByCurrencies && isFilteredByCategories
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
    getLocations,
    getLocationByUuid,
    locations,
    setLocations,

    selectedUuid,
    goToLocation,
  }
})
