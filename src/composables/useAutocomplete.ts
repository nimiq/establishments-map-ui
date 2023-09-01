import { useDebounceFn } from '@vueuse/core'
import { computed, ref } from 'vue'
import { detectLanguage } from '@/i18n/i18n-setup'
import { useMap } from '@/stores/map'
import { AutocompleteStatus, type Suggestion, SuggestionType } from '@/types'
import { searchLocations } from '@/database'

enum GoogleAutocompleteFor {
  Location = 'establishment',
  Regions = '(regions)',
}

export function useAutocomplete() {
  const status = ref<AutocompleteStatus>(AutocompleteStatus.NoResults)
  const dbSuggestions = ref<Suggestion[]>([])
  const googleSuggestions = ref<Suggestion[]>([])
  const suggestions = computed(() => dbSuggestions.value.concat(googleSuggestions.value))

  // Google Autocomplete
  const sessionToken = ref<google.maps.places.AutocompleteSessionToken>()
  const autocompleteService = ref<google.maps.places.AutocompleteService>()

  async function autocompleteGoogle(query: string, autocompleteFor: GoogleAutocompleteFor) {
    sessionToken.value ||= new google.maps.places.AutocompleteSessionToken()
    autocompleteService.value ||= new google.maps.places.AutocompleteService()

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

  async function autocompleteDatabase(query: string) {
    const locations = await searchLocations(query)
    dbSuggestions.value = locations.map(q => Object.assign(q, { type: SuggestionType.Location }))
  }

  async function querySearch(query: string) {
    status.value = AutocompleteStatus.Loading

    if (!query) {
      dbSuggestions.value = []
      googleSuggestions.value = []
      return
    }

    const result = await Promise.allSettled([autocompleteDatabase(query), autocompleteGoogle(query, GoogleAutocompleteFor.Regions)])

    if (result.every(r => r.status === 'rejected')) {
      status.value = AutocompleteStatus.Error
      return
    }

    status.value = suggestions.value.length ? AutocompleteStatus.WithResults : AutocompleteStatus.NoResults
  }

  return {
    status,
    suggestions,
    dbSuggestions,
    googleSuggestions,
    autocompleteGoogleLocations: useDebounceFn((query: string) => autocompleteGoogle(query, GoogleAutocompleteFor.Location), 300),
    querySearch: useDebounceFn((query: string) => querySearch(query), 300),
  }
}
