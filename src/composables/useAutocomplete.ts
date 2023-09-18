import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'
import { AutocompleteStatus, type Suggestion, SuggestionType } from 'types'
import { searchLocations } from 'database'
import { detectLanguage } from '@/i18n/i18n-setup'
import { useMap } from '@/stores/map'
import { DATABASE_ARGS } from '@/shared'

enum GoogleAutocompleteFor {
  Location = 'establishment',
  Regions = '(regions)',
}

export function useAutocomplete() {
  const status = ref<AutocompleteStatus>(AutocompleteStatus.Initial)
  const googleSuggestions = ref<Suggestion[]>([])
  const suggestions = ref<Suggestion[]>([])

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
      const suggestions = predictions
        .filter(p => !!p.place_id)
        .map(p => ({
          id: p.place_id as string,
          label: p.description,
          type: SuggestionType.GoogleLocation,
          matchedSubstrings: p.matched_substrings,
        }))

      /* eslint-disable no-console */
      console.group(`🔍 Google Autocomplete "${query}"`)
      console.table(suggestions)
      console.groupEnd()
      /* eslint-enable no-console */

      googleSuggestions.value = suggestions
    })
  }

  async function autocompleteDatabase(query: string) {
    const locations = await searchLocations(DATABASE_ARGS, query)
    return locations.map(q => Object.assign(q, { type: SuggestionType.Location }))
  }

  // If we search just for new candidates, we don't need to search in the database
  // and we just search locations in Google
  async function querySearch(query: string, justNewCandidates = false) {
    // eslint-disable-next-line no-console
    console.group(`🔍 Autocomplete "${query}"`)

    status.value = AutocompleteStatus.Loading
    if (!query) {
      suggestions.value = []
      return
    }

    const result = justNewCandidates
      ? await Promise.allSettled([autocompleteGoogle(query, GoogleAutocompleteFor.Location)])
      : await Promise.allSettled([autocompleteDatabase(query), autocompleteGoogle(query, GoogleAutocompleteFor.Regions)])

    /* eslint-disable no-console */
    console.log(`Got ${result.length} results`)
    console.log(result)
    console.groupEnd()
    /* eslint-enable no-console */

    if (result.every(r => r.status === 'rejected')) {
      status.value = AutocompleteStatus.Error
      return
    }
    if (justNewCandidates) {
      suggestions.value = googleSuggestions.value
    }
    else {
      const db = result[0].status === 'fulfilled' ? result[0].value : [] as Suggestion[]
      suggestions.value = [...db!, ...googleSuggestions.value]
    }

    status.value = suggestions.value.length ? AutocompleteStatus.WithResults : AutocompleteStatus.NoResults
  }

  const debouncer = useDebounceFn((query: string, justNewCandidates: boolean) => querySearch(query, justNewCandidates), 400)
  return {
    status,
    suggestions,
    querySearch(query: string, justNewCandidates = false) {
      status.value = AutocompleteStatus.Loading
      debouncer(query, justNewCandidates)
    },
  }
}
