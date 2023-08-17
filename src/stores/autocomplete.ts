import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useMap } from './map'
import { queryResults as queryResultsDb } from '@/database'
import type { Category, Currency } from '@/database'

export enum SuggestionType {
  ESTABLISHMENT = 'location',
  CATEGORY = 'category',
  CURRENCY = 'currency',
  GOOGLE_ESTABLISHMENT = 'googleLocation',
  GOOGLE_REGIONS = 'regions',
}

export type Suggestion = {
  label: string
} & ({
  id: string // Google Place ID
  type: SuggestionType.GOOGLE_ESTABLISHMENT | SuggestionType.GOOGLE_REGIONS
  matchedSubstrings: google.maps.places.AutocompletePrediction['matched_substrings']
} | {
  id: Category
  type: SuggestionType.CATEGORY
  matchedSubstrings: undefined
} | {
  id: Currency
  type: SuggestionType.CURRENCY
  matchedSubstrings: undefined
} | {
  id: string // Location UUID
  type: SuggestionType.ESTABLISHMENT
  matchedSubstrings: undefined
})

export enum AutocompleteStatus {
  INITIAL = 'initial',
  LOADING = 'loading',
  WITH_RESULTS = 'with-results',
  NO_RESULTS = 'no-results',
}

interface SearchFor {
  searchForLocation?: boolean
  searchForRegions?: boolean
}

export const useAutocomplete = defineStore('autocomplete', () => {
  const status = ref<AutocompleteStatus>(AutocompleteStatus.NO_RESULTS)
  const dbSuggestions = ref<Suggestion[]>([])
  const googleSuggestions = ref<Suggestion[]>([])

  // Google Autocomplete
  const sessionToken = ref<google.maps.places.AutocompleteSessionToken>()
  const autocompleteService = ref<google.maps.places.AutocompleteService>()

  const mapStore = useMap()
  const { map, mapReady } = storeToRefs(mapStore)

  function init() {
    if (!sessionToken.value)
      sessionToken.value = new google.maps.places.AutocompleteSessionToken()
    if (!autocompleteService.value)
      autocompleteService.value = new google.maps.places.AutocompleteService()
  }

  async function autocompleteGoogle(query: string, { searchForLocation, searchForRegions }: SearchFor) {
    init()
    await autocompleteService.value?.getPlacePredictions({
      input: query,
      sessionToken: sessionToken.value,
      location: mapReady.value && map.value ? map.value.getCenter() : undefined,
      bounds: mapReady.value && map.value ? map.value.getBounds() : undefined,
      types: [
        searchForLocation ? 'location' : '',
        searchForRegions ? '(regions)' : '',
      ].filter(Boolean),
    }, (predictions, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions)
        return

      googleSuggestions.value = predictions.map(p => ({
        id: p.place_id,
        label: p.description,
        type: SuggestionType.GOOGLE_ESTABLISHMENT,
        matchedSubstrings: p.matched_substrings,
      }))
    })
  }

  async function querySearch(query: string) {
    if (!query) {
      dbSuggestions.value = []
      return
    }

    dbSuggestions.value = await queryResultsDb(query)
    autocompleteGoogle(query, { searchForLocation: true })
  }

  return {
    status,
    querySearch,
    dbSuggestions,
    googleSuggestions,
    autocompleteGoogle,
  }
})
