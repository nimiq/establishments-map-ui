import { useThrottleFn } from '@vueuse/core'
import { ref } from 'vue'
import { queryResults as queryResultsDb } from '@/database'
import { detectLanguage } from '@/i18n/i18n-setup'
import { useMap } from '@/stores/map'
import { AutocompleteStatus, type Suggestion, SuggestionType } from '@/types'

enum GoogleAutocompleteFor {
  Location = 'establishment',
  Regions = '(regions)',
}

export function useAutocomplete() {
  const status = ref<AutocompleteStatus>(AutocompleteStatus.NoResults)
  const dbSuggestions = ref<Suggestion[]>([])
  const googleSuggestions = ref<Suggestion[]>([])

  // Google Autocomplete
  const sessionToken = ref<google.maps.places.AutocompleteSessionToken>()
  const autocompleteService = ref<google.maps.places.AutocompleteService>()

  function init() {
    sessionToken.value ||= new google.maps.places.AutocompleteSessionToken()
    autocompleteService.value ||= new google.maps.places.AutocompleteService()
  }

  async function autocompleteGoogle(query: string, autocompleteFor: GoogleAutocompleteFor) {
    init()
    const request: google.maps.places.AutocompletionRequest = {
      input: query,
      sessionToken: sessionToken.value,
      types: [autocompleteFor],
      language: detectLanguage(),
      ...(autocompleteFor === GoogleAutocompleteFor.Regions
        ? { locationBias: useMap().map?.getBounds() }
        : undefined),
    }
    const fn = autocompleteFor === GoogleAutocompleteFor.Regions ? 'getQueryPredictions' : 'getPlacePredictions'
    await autocompleteService.value?.[fn](request, (predictions, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions)
        return

      googleSuggestions.value = predictions
        .filter(p => !!p.place_id)
        .map(p => ({
          id: p.place_id as string,
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
    autocompleteGoogle(query, GoogleAutocompleteFor.Regions)
  }

  return {
    status,
    querySearch,
    dbSuggestions,
    googleSuggestions,
    autocompleteGoogleLocations: useThrottleFn((query: string) => autocompleteGoogle(query, GoogleAutocompleteFor.Location), 300),
  }
}
