import type { Feature, MultiPolygon } from '@turf/helpers'
import { useRouteQuery } from '@vueuse/router'
import { getLocations as getDbLocations, getLocation } from 'database'
import { defineStore } from 'pinia'
import { addBBoxToArea, bBoxIsWithinArea, getItemsWithinBBox } from 'shared'
import type { BoundingBox, Location } from 'types'
import { computed, ref, shallowReactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFilters } from './filters'
import { useMap } from './map'
import { getAnonDatabaseArgs, parseLocation } from '@/shared'

export const useLocations = defineStore('locations', () => {
  const { filterLocations } = useFilters()

  // Reduce redundant database fetches by reusing fetched locations by tracking the areas explored by the user
  const visitedAreas = ref<Feature<MultiPolygon>>()

  const locationsMap = shallowReactive(new Map<string, Location>())
  const locations = computed(() => [...locationsMap.values()])

  function setLocations(locations: Location[]) {
    locations.forEach(location => locationsMap.set(location.uuid, location))
  }

  async function getLocations(boundingBox: BoundingBox): Promise<Location[]> {
    if (bBoxIsWithinArea(boundingBox, visitedAreas.value)) {
      // We already have scanned this area, no need to fetch from the database
      const locations = [...locationsMap.values()]
      const filteredLocations = filterLocations(locations) // Filter locations by categories and currencies
      return getItemsWithinBBox(filteredLocations, boundingBox) // Filter locations by bounding box
    }

    // New area, we need to fetch from the database
    const newLocations = await getDbLocations(await getAnonDatabaseArgs(), boundingBox, parseLocation)
    setLocations(newLocations)
    visitedAreas.value = addBBoxToArea(boundingBox, visitedAreas.value)
    return filterLocations(newLocations)
  }

  async function getLocationByUuid(uuid: string) {
    if (locationsMap.has(uuid))
      return locationsMap.get(uuid)
    const location = await getLocation(await getAnonDatabaseArgs(), uuid, parseLocation)
    if (!location)
      return
    locationsMap.set(uuid, location)
    return location
  }

  const router = useRouter()
  const route = useRoute()

  const selectedUuid = useRouteQuery<string | undefined>('uuid') // No need to check for string[]. UUID checked in router.ts
  watch(() => selectedUuid.value, (newUuid) => {
    if (newUuid)
      router.push({ query: { uuid: newUuid, ...route.query } })
  })

  async function goToLocation(uuid: string) {
    const location = await getLocationByUuid(uuid)
    if (!location)
      return false

    selectedUuid.value = uuid

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
    visitedAreas,

    selectedUuid,
    goToLocation,
  }
})
