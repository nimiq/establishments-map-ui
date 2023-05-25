import { useGoogle } from "@/stores/google";
import { useApi } from "@/stores/api";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export enum SuggestionType {
  API = "api", // this contains ApiEstablishments, currencies and categories suggestion all in one endpoint
  GOOGLE_ESTABLISHMENT = "googleEstablishment",
  GOOGLE_REGIONS = "regions",
}

export type Suggestion = {
  label: string,
  matchedSubstrings: google.maps.places.AutocompletePrediction["matched_substrings"]
  type: SuggestionType,

  apiSuggestion?: 'establishment' | 'category' | 'currency'

  // values for id
  // googleEstablishment -> google place id
  // regions -> google place id
  // apiEstablishment -> Establishment UUID
  // currency -> currency symbol
  // category -> category label
  id: string,
}

export enum AutocompleteStatus {
  LOADING = "loading",
  WITH_RESULTS = "with-results",
  NO_RESULTS = "no-results",
  ERROR = "error",
}

type UseAutocompleteOptions = {
  searchFor: SuggestionType[]
}

export function useAutocomplete({ searchFor }: UseAutocompleteOptions) {
  const status = ref<AutocompleteStatus>(AutocompleteStatus.NO_RESULTS);
  const suggestions = ref<Suggestion[]>([]);

  const googleStore = useGoogle()
  const { autocomplete: autocompleteGoogle } = googleStore;
  const { suggestions: suggestionsGoogle } = storeToRefs(googleStore)

  const apiStore = useApi()
  const { autocomplete: autocompleteApi } = apiStore;
  const { suggestions: suggestionsApi } = storeToRefs(apiStore);

  async function fetchAutocompleteApi(query: string) {
    await autocompleteApi(query).catch(() => {
      status.value = AutocompleteStatus.ERROR;
    })

    if (suggestionsApi.value.length) {
      status.value = AutocompleteStatus.WITH_RESULTS;
    }
  }

  async function fetchAutocompleteGoogle(query: string) {
    await autocompleteGoogle(query, searchFor as SuggestionType[]).catch(() => {
      status.value = AutocompleteStatus.ERROR;
    })

    if (suggestionsGoogle.value.length) {
      status.value = AutocompleteStatus.WITH_RESULTS;
    }
  }

  async function autocomplete(query: string) {
    status.value = AutocompleteStatus.LOADING;

    // There is no such filter in the API, so we need to fetch all the suggestions
    const hasApiSuggestions = searchFor?.includes(SuggestionType.API);
    const hasGoogleSuggestions = searchFor?.includes(SuggestionType.GOOGLE_ESTABLISHMENT) || searchFor?.includes(SuggestionType.GOOGLE_REGIONS);

    if (hasApiSuggestions && hasGoogleSuggestions) {
      await Promise.all([fetchAutocompleteApi(query), fetchAutocompleteGoogle(query)])
      suggestions.value = [...suggestionsApi.value, ...suggestionsGoogle.value]
    } else if (hasApiSuggestions) {
      await fetchAutocompleteApi(query)
      suggestions.value = suggestionsApi.value
    } else if (hasGoogleSuggestions) {
      await fetchAutocompleteGoogle(query)
      suggestions.value = suggestionsGoogle.value
    }

    if (suggestions.value.length === 0) {
      status.value = AutocompleteStatus.NO_RESULTS;
    }
  }

  return {
    autocomplete,
    suggestions,
    status
  }
}
