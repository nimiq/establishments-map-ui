import { defineStore, storeToRefs } from 'pinia'
import type { Feature, MultiPolygon } from '@turf/helpers'
import { multiPolygon } from '@turf/helpers'
import { computed, ref, watch } from 'vue'
import type { BoundingBox, Cryptocity, CryptocityData, CryptocityDatabase } from 'types'
import { addBBoxToArea, bBoxIsWithinArea, getItemsWithinBBox } from 'shared'
import { getCryptocities as getDbCryptocities } from 'database'
import { useMap } from './map'
import type { ExpiringValue } from '@/composables/useExpiringStorage'
import { useExpiringStorage } from '@/composables/useExpiringStorage'
import { getAnonDatabaseArgs } from '@/shared'
import { cryptocitiesUi } from '@/assets-dev/cryptocities-assets'

type StoredCryptocities = ExpiringValue<{ area: Feature<MultiPolygon>; data: Partial<Record<Cryptocity, CryptocityData>> }>

// Initial value of the cryptocities data structure
const defaultValue: StoredCryptocities['value'] = { area: multiPolygon([]), data: {} }

export const useCryptocities = defineStore('cryptocities', () => {
  const { boundingBox } = storeToRefs(useMap())

  const { payload: cryptocities } = useExpiringStorage('cryptocities', { expiresIn: 30 * 24 * 60 * 60 * 1000, defaultValue })
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

  const recentlyAttachedCryptocities = ref<Cryptocity[]>([])
  watch(attachedCryptocities, (newAttached, oldAttached) => {
    recentlyAttachedCryptocities.value = newAttached.filter(city => !oldAttached.includes(city))
  })

  return {
    cryptocities,
    loadedCitiesNames,
    getCryptocities,
    setCryptocities,
    cryptocitiesInView,
    cryptocitiesSingles,
    attachedCryptocities,
    recentlyAttachedCryptocities,
  }
})
