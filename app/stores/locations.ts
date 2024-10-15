import type { Feature, MultiPolygon } from 'geojson'
// import { getLocations as getDbLocations, getLocation } from 'database'
import { useRouteQuery } from '@vueuse/router'
import type { Database } from '~~/types/supabase'
import { parseLocation } from '~/shared'

export const useLocations = defineStore('locations', () => {
  // Reduce redundant database fetches by reusing fetched locations by tracking the areas explored by the user
  const visitedAreas = ref<Feature<MultiPolygon>>()

  const supabase = useSupabaseClient<Database>()

  // const { payload: locationsMap } = useExpiringStorage('locations', {
  //   defaultValue: {} as Record<string, MapLocation>,
  //   expiresIn: 7 * 24 * 60 * 60 * 1000,
  //   timestamp: useApp().timestamps?.locations,
  // })
  const locationsMap = ref({} as Record<string, MapLocation>)
  const locations = computed(() => Object.values(locationsMap.value))

  function setLocations(locations: MapLocation[]) {
    locations.forEach(location => locationsMap.value[location.uuid] = location)
  }

  async function getLocations(boundingBox: BoundingBox): Promise<MapLocation[]> {
    if (bBoxIsWithinArea(boundingBox, visitedAreas.value)) {
      // We already have scanned this area, no need to fetch from the database
      return getItemsWithinBBox(locations.value, boundingBox) // Filter locations by bounding box
    }

    const { data: _newLocations, error } = await supabase.rpc('get_locations', { ...boundingBox })
    if (error)
      throw error
    const newLocations = (_newLocations as unknown as MapLocation[]).map(parseLocation)
    setLocations(newLocations)
    visitedAreas.value = addBBoxToArea(boundingBox, visitedAreas.value)
    return newLocations
  }

  async function getLocationByUuid(uuid: string) {
    if (uuid in locationsMap.value)
      return locationsMap.value[uuid]
    const { data: _location, error } = await supabase.rpc('get_location_by_uuid', { location_uuid: uuid })
    if (error)
      throw error
    const location = parseLocation(_location as unknown as MapLocation)
    if (!location)
      return
    locationsMap.value[uuid] = location
    return location
  }

  const selectedUuid = useRouteQuery<string | undefined>('uuid') // No need to check for string[]. UUID checked in router.ts

  interface GoToLocationOptions {
    open?: boolean
  }

  async function goToLocation(uuid: string, { open = false }: GoToLocationOptions = {}) {
    const location = await getLocationByUuid(uuid)
    if (!location)
      return false

    selectedUuid.value = uuid

    useMap().setPosition({ center: { lat: location.lat, lng: location.lng }, zoom: 19 })

    if (open) {
      const { singles } = storeToRefs(useMarkers())
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      while (!singles.value.some(s => s.uuid === uuid))
        await sleep(100) // Try to wait for the item to be added
      await nextTick() // Wait for the marker to be rendered

      // once the marker is rendered, we can trigger the click event to open the modal
      const trigger = document.querySelector(`[data-trigger-uuid="${uuid}"]`) as HTMLElement
      trigger?.click()
    }

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
