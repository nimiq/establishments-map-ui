export const enum Autocomplete {
  GoogleBussines = 'establishment',
  GoogleRegions = '(regions)',
  CryptoMapLocation = 'crypto-map-location',
}

export const enum AutocompleteStatus {
  Initial = 'initial',
  Loading = 'loading',
  WithResults = 'with-results',
  NoResults = 'no-results',
  Error = 'error',
}

export interface PredictionSubstring { length: number, offset: number }
export type LocationSuggestion = Pick<MapLocation, 'uuid' | 'name'> & { matchedSubstrings: PredictionSubstring[] }
export interface GoogleSuggestion { label: string, placeId: string, matchedSubstrings: PredictionSubstring[] }

interface UseAutocompleteOptions {
  autocomplete: Autocomplete[]
  persistState?: boolean
}

export function useAutocomplete({ autocomplete, persistState = true }: UseAutocompleteOptions) {
  const status = ref<AutocompleteStatus>(AutocompleteStatus.Initial)
  const googleSuggestions = ref<GoogleSuggestion[]>([])
  const locationSuggestions = ref<LocationSuggestion[]>([])
  const querySearch = useDebounceFn(_querySearch, 400)

  const route = useRoute()
  const router = useRouter()
  const queryName = 'search'
  let initialQuery = ''
  if (persistState)
    initialQuery = Array.isArray(route.query[queryName]) ? route.query[queryName][0] : route.query[queryName] || ''

  const query = ref(initialQuery)
  watch(query, (newValue, oldValue) => {
    if (newValue === oldValue)
      return

    if (persistState)
      router.replace({ query: { ...route.query, [queryName]: newValue !== '' ? newValue : undefined } })

    if (!query.value) {
      status.value = AutocompleteStatus.Initial
      clearSuggestions()
    }
    else {
      if ((newValue !== '' && oldValue === '') || (googleSuggestions.value.length === 0 && locationSuggestions.value.length === 0))
        status.value = AutocompleteStatus.Loading
      if (newValue === '' && oldValue !== '')
        status.value = AutocompleteStatus.Initial
      querySearch()
    }
  }, { immediate: true })

  // The first time the user types something, we hide the hint
  watch(query, () => useUIParams().hideSearchBoxHint(), { once: true })

  function clearSuggestions() {
    googleSuggestions.value = []
    locationSuggestions.value = []
  }

  // Google Autocomplete
  const sessionToken = ref<google.maps.places.AutocompleteSessionToken>()
  const autocompleteService = ref<google.maps.places.AutocompleteService>()

  async function autocompleteGoogle() {
    sessionToken.value ||= new google.maps.places.AutocompleteSessionToken()
    autocompleteService.value ||= new google.maps.places.AutocompleteService()

    const types = []
    const searchForBusinnesses = autocomplete.includes(Autocomplete.GoogleBussines)
    const searchForRegions = autocomplete.includes(Autocomplete.GoogleRegions)
    if (searchForBusinnesses)
      types.push(Autocomplete.GoogleBussines)
    if (searchForRegions)
      types.push(Autocomplete.GoogleRegions)

    if (!types.length) {
      googleSuggestions.value = []
      return
    }

    const locationBias = searchForRegions ? useMap().map?.getBounds() : undefined

    const request: google.maps.places.AutocompletionRequest = {
      input: query.value,
      sessionToken: sessionToken.value,
      types,
      language: detectLanguage(),
      locationBias,
    }

    const fn = searchForRegions ? 'getQueryPredictions' : 'getPlacePredictions'

    return await (autocompleteService.value?.[fn](request, (predictions, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions)
        return
      googleSuggestions.value = predictions
        .filter(p => !!p.place_id)
        .map(p => ({
          placeId: p.place_id as string,
          label: p.description,
          matchedSubstrings: p.matched_substrings,
        } satisfies GoogleSuggestion))
    }))
  }

  async function autocompleteLocations() {
    locationSuggestions.value = await searchLocations(await getAnonDatabaseArgs(), query.value)
  }

  // If we search just for new candidates, we don't need to search in the database
  // and we just search locations in Google
  async function _querySearch() {
    // eslint-disable-next-line no-console
    console.group(`🔍 Autocomplete "${query.value}"`)

    if (!query.value) {
      clearSuggestions()
      return
    }

    const result = await Promise.allSettled([autocompleteLocations(), autocompleteGoogle()])

    /* eslint-disable no-console */
    console.log(`Got ${result.length} results`)
    console.log(result)
    console.groupEnd()
    /* eslint-enable no-console */

    if (result.some(r => r.status === 'rejected')) {
      // status.value = AutocompleteStatus.Error
      status.value = AutocompleteStatus.WithResults
      googleSuggestions.value = [{ label: 'This is a test', placeId: '1', matchedSubstrings: [{ length: 0, offset: 1 }] }]
      return
    }

    status.value = googleSuggestions.value.length || locationSuggestions.value.length ? AutocompleteStatus.WithResults : AutocompleteStatus.NoResults
  }

  onUnmounted(() => {
    query.value = ''
  })

  return {
    query,
    status,
    googleSuggestions,
    locationSuggestions,
  }
}

export function highlightMatches(str: string, matches: PredictionSubstring[]) {
  // Split into unicode chars because match positions in google.maps.places.AutocompletePrediction["matched_substrings"]
  // are based on unicode chars, as opposed to surrogate pairs of Javascript strings for Unicode chars on astral planes
  // (see https://mathiasbynens.be/notes/javascript-unicode)
  const parts = [...str]

  // Sanitize potential html in input string to mitigate risk of XSS because the result will be fed to v-html. Note that
  // this manipulation does not change indices/positions of our string parts (initial unicode characters).
  for (let i = 0; i < parts.length; ++i) {
    if (parts[i] === '<')
      parts[i] = '&lt;'
    else if (parts[i] === '>')
      parts[i] = '&gt;'
  }

  // Make matches bold. Note that our manipulations do not change indices/positions of our string parts (initial unicode
  // characters), thus we don't have to adapt match offsets of subsequent matches. Additionally, matches are probably
  // not overlapping, but it would also not hurt.
  for (const match of matches || []) {
    parts[match.offset] = `<b>${parts[match.offset]}`
    parts[match.offset + match.length - 1] = `${parts[match.offset + match.length - 1]}</b>`
  }

  return parts.join('')
}
