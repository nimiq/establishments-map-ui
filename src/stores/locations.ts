import { useRouteQuery } from '@vueuse/router'
import { getLocations as getDbLocations, getLocation } from 'database'
import { defineStore } from 'pinia'
import { addBBoxToArea, bBoxIsWithinArea, getLocationsWithinBBox } from 'shared'
import type { BoundingBox, Location } from 'types'
import { shallowReactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MultiPolygon } from '@turf/helpers'
import { useMap } from './map'
import { useFilters } from './filters'
import { DATABASE_ARGS, parseLocation } from '@/shared'

export const useLocations = defineStore('locations', () => {
  const { filterLocations } = useFilters()

  // Reduce redundant database fetches by reusing fetched locations by tracking the areas explored by the user
  let visitedAreas: MultiPolygon

  const locationsMap = shallowReactive(new Map<string, Location>())

  function setLocations(locations: Location[]) {
    locations.forEach(location => locationsMap.set(location.uuid, location))
  }

  async function getLocations(boundingBox: BoundingBox): Promise<Location[]> {
    if (bBoxIsWithinArea(boundingBox, visitedAreas)) {
      const locations = [...locationsMap.values()]
      const filteredLocations = filterLocations(locations) // Filter locations by categories and currencies
      return getLocationsWithinBBox(filteredLocations, boundingBox) // Filter locations by bounding box
    }

    const newLocations = await getDbLocations(DATABASE_ARGS, boundingBox, parseLocation)
    setLocations(newLocations)

    visitedAreas = addBBoxToArea(boundingBox, visitedAreas)

    return filterLocations(newLocations)
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
    // locations,
    setLocations,

    selectedUuid,
    goToLocation,
  }
})
