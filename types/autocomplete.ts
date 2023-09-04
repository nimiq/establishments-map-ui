export enum AutocompleteStatus {
  Initial = 'initial',
  Loading = 'loading',
  WithResults = 'with-results',
  NoResults = 'no-results',
  Error = 'error',
}

export interface SearchFor {
  searchForLocation?: boolean
  searchForRegions?: boolean
}

export enum SuggestionType {
  Location = 'location',
  GoogleLocation = 'googleLocation',
  Region = 'regions',
}

export interface PredictionSubstring {
  /**
   * The length of the substring.
   */
  length: number
  /**
   * The offset to the substring&#39;s start within the description string.
   */
  offset: number
}

export interface Suggestion {
  label: string
  id: string // Google Place ID | Location UUID
  type: SuggestionType.GoogleLocation | SuggestionType.Region | SuggestionType.Location
  matchedSubstrings: PredictionSubstring[]
}
