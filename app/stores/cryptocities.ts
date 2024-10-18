import type { Database } from '~~/types/supabase'
import type { Feature, MultiPolygon } from 'geojson'
import { cryptocitiesUi } from '@/assets-dev/cryptocities-assets'
import { multiPolygon } from '@turf/turf'

type StoredCryptocities = ExpiringValue<{ area: Feature<MultiPolygon>, data: Partial<Record<CryptocityType, CryptocityData>> }>

// Initial value of the cryptocities data structure
const defaultValue: StoredCryptocities['value'] = { area: multiPolygon([]), data: {} }

export const useCryptocities = defineStore('cryptocities', () => {
  const { boundingBox, map, zoom } = storeToRefs(useMap())

  const cryptocities = ref(defaultValue)
  const loadedCitiesNames = computed(() => [...Object.keys(cryptocities.value.data)] as CryptocityType[])
  const allCryptocities = computed(() => [...Object.values(cryptocities.value.data)])
  const cryptocitiesInView = computed(() => boundingBox.value ? getItemsWithinBBox(allCryptocities.value, boundingBox.value) : [])

  async function getCryptocities(boundingBox: BoundingBox) {
    if (bBoxIsWithinArea(boundingBox, cryptocities.value.area))
      return allCryptocities.value

    const supabase = useSupabaseClient<Database>()
    const { data: newCryptocities, error } = await supabase.rpc('get_cryptocities', { ...boundingBox, excluded_cities: loadedCitiesNames.value })
    if (error)
      throw error
    const parsed = newCryptocities.map((c) => {
      return {
        city: c.city as CryptocityType,
        lat: c.lat,
        lng: c.lng,
        locationsCount: c.locations_count,
        shape: c.shape as unknown as CryptocityDatabase['shape'],
        showCardAtZoom: c.show_card_at_zoom,
        url: c.url,
      } satisfies CryptocityDatabase
    })
    return setCryptocities(boundingBox, parsed)
  }

  function setCryptocities(boundingBox: BoundingBox, newCryptocities: CryptocityDatabase[] = []) {
    cryptocities.value.area = addBBoxToArea(boundingBox, cryptocities.value.area)
    newCryptocities.forEach(cryptocity => cryptocities.value.data[cryptocity.city] = Object.assign(cryptocity, cryptocitiesUi[cryptocity.city]))
    return allCryptocities.value
  }

  // Cryptocities that have not been attached to any cluster
  const attachedCryptocities = ref<CryptocityType[]>([])

  // Cryptocities no in attachedCryptocities
  const cryptocitiesSingles = computed(() => allCryptocities.value.filter(cryptocity => !attachedCryptocities.value.includes(cryptocity.city)))

  const CRYPTOCITY_MIN_ZOOM = 7
  const CRYPTOCITY_MIN_OPACITY = 0.01
  const CRYPTOCITY_MAX_ZOOM = 21
  const CRYPTOCITY_MAX_OPACITY = 0.17

  function linearRegression(x: number): number {
    if (x < CRYPTOCITY_MIN_ZOOM || x > CRYPTOCITY_MAX_ZOOM)
      return 0

    const m = (CRYPTOCITY_MIN_OPACITY - CRYPTOCITY_MAX_OPACITY) / (CRYPTOCITY_MAX_ZOOM - CRYPTOCITY_MIN_ZOOM)
    const b = CRYPTOCITY_MAX_OPACITY - m * CRYPTOCITY_MIN_ZOOM
    return m * x + b
  }

  const addedShapes = ref<CryptocityType[]>([])
  watchDebounced([allCryptocities, boundingBox], () => {
    if (!map.value)
      return
    allCryptocities.value.filter(({ city }) => !addedShapes.value.includes(city)).forEach(({ city, shape }) => {
      map.value?.data.addGeoJson(shape)
      addedShapes.value.push(city)
    })
    map.value?.data.setStyle({ fillColor: 'rgb(31, 35, 72)', fillOpacity: linearRegression(zoom.value), strokeWeight: 1.5, strokeColor: 'rgb(31, 35, 72)', strokeOpacity: 0.8, cursor: 'default' })
  }, { debounce: 300, immediate: true })

  return {
    cryptocities,
    getCryptocities,
    setCryptocities,
    cryptocitiesInView,
    cryptocitiesSingles,
    attachedCryptocities,
  }
})
