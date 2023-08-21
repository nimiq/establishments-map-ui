import { ref } from 'vue'
import { queryResults as queryResultsDb } from '@/database'
import { useMap } from '@/stores/map'
import { AutocompleteStatus, type Suggestion, SuggestionType } from '@/types'

interface AutocompleteGoogleOptions {
  searchForLocation?: boolean
  searchForRegions?: boolean
}

export function useAutocomplete() {
  const status = ref<AutocompleteStatus>(AutocompleteStatus.NoResults)
  const dbSuggestions = ref<Suggestion[]>([])
  const googleSuggestions = ref<Suggestion[]>([])

  // Google Autocomplete
  const sessionToken = ref<google.maps.places.AutocompleteSessionToken>()
  const autocompleteService = ref<google.maps.places.AutocompleteService>()

  function init() {
    if (!sessionToken.value)
      sessionToken.value = new google.maps.places.AutocompleteSessionToken()
    if (!autocompleteService.value)
      autocompleteService.value = new google.maps.places.AutocompleteService()
  }

  async function autocompleteGoogle(query: string, { searchForLocation, searchForRegions }: AutocompleteGoogleOptions) {
    init()
    await autocompleteService.value?.getPlacePredictions({
      input: query,
      sessionToken: sessionToken.value,
      location: useMap().map.value?.getCenter(),
      bounds: useMap().map.value?.getBounds(),
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
        type: SuggestionType.GoogleLocation,
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
}
