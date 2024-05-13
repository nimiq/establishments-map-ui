import type { Feature, MultiPolygon } from 'geojson'
import { multiPolygon } from '@turf/turf'
import type { BoundingBox, Cryptocity, CryptocityData, CryptocityDatabase } from 'types'
import { addBBoxToArea, bBoxIsWithinArea, getItemsWithinBBox } from 'geo'
import { getCryptocities as getDbCryptocities } from 'database'
import { type ExpiringValue, useExpiringStorage } from '@/composables/useExpiringStorage'
import { getAnonDatabaseArgs } from '@/shared'
import { cryptocitiesUi } from '@/assets-dev/cryptocities-assets'

type StoredCryptocities = ExpiringValue<{ area: Feature<MultiPolygon>, data: Partial<Record<Cryptocity, CryptocityData>> }>

// Initial value of the cryptocities data structure
const defaultValue: StoredCryptocities['value'] = { area: multiPolygon([]), data: {} }

export const useCryptocities = defineStore('cryptocities', () => {
  const { boundingBox, map, zoom } = storeToRefs(useMap())

  const { payload: cryptocities } = useExpiringStorage('cryptocities', {
    expiresIn: 30 * 24 * 60 * 60 * 1000,
    defaultValue,
    timestamp: useApp().timestamps?.cryptocities,
  })
  const loadedCitiesNames = computed(() => [...Object.keys(cryptocities.value.data)] as Cryptocity[])
  const allCryptocities = computed(() => [...Object.values(cryptocities.value.data)])
  const cryptocitiesInView = computed(() => boundingBox.value ? getItemsWithinBBox(allCryptocities.value, boundingBox.value) : [])

  async function getCryptocities(boundingBox: BoundingBox) {
    if (bBoxIsWithinArea(boundingBox, cryptocities.value.area))
      return allCryptocities.value

    const newCryptocities = await getDbCryptocities(await getAnonDatabaseArgs(), { boundingBox, excludedCities: loadedCitiesNames.value })
    return setCryptocities(boundingBox, newCryptocities)
  }

  function setCryptocities(boundingBox: BoundingBox, newCryptocities: CryptocityDatabase[] = []) {
    cryptocities.value.area = addBBoxToArea(boundingBox, cryptocities.value.area)
    newCryptocities.forEach(cryptocity => cryptocities.value.data[cryptocity.city] = Object.assign(cryptocity, cryptocitiesUi[cryptocity.city]))
    return allCryptocities.value
  }

  // Cryptocities that have not been attached to any cluster
  const attachedCryptocities = ref<Cryptocity[]>([])

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

  const addedShapes = ref<Cryptocity[]>([])
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
