import { Configuration, EstablishmentsApi, type PostCandidateRequest as CandidateRequest, type CategoriesIssueInner as CategoriesIssue, type CategoryInner as Category, type CryptoEstablishment as CryptoEstablishmentApi, type CryptoEstablishmentBaseInner as CryptoEstablishmentBaseApi, type CurrencyInner as Currency, type PostEstablishmentIssueRequest as EstablishmentIssueRequest, type SearchEstablishmentsRequest } from "@/api";
import type { GetProviders200Response as Provider } from "@/api/models/GetProviders200Response";
import { SuggestionType, type Suggestion } from "@/composables/useAutocomplete";
import { defineStore, storeToRefs } from "pinia";
import { onMounted, ref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEstablishments, type BaseEstablishment, type Establishment } from "./establishments";
import { useMap } from "./map";

const basePath: string = import.meta.env.VITE_URL_API_URL
const googleMapsKey: string = import.meta.env.VITE_GOOGLE_MAP_KEY

export const establishmentsApi = new EstablishmentsApi(new Configuration({ basePath }))

export const useApi = defineStore("api", () => {
  // Items that are loaded only once at the beginning
  const categoriesIssue = ref<CategoriesIssue[]>([])
  const categories = ref(new Map<string, Category>());
  const currencies = ref(new Map<string, Currency>());
  const providers = ref(new Map<number, Provider>());

  const route = useRoute()
  const router = useRouter()

  // Filters
  const selectedFilters: Ref<{ currencies: Currency[], categories: Category[] }> = ref({ currencies: [], categories: [] })

  watch(selectedFilters, async ({ categories: newCategories, currencies: newCurrencies }) => {
    router.push({
      query: {
        categories: newCategories.map(c => c.label),
        currencies: newCurrencies.map(c => c.symbol),
      }
    })
    await search()
  })

  const mapStore = useMap()
  const { boundingBox, surroundingBoundingBox } = storeToRefs(mapStore)

  // Converts crypto location model from the API to the model used in the app
  function parseBaseEstablishment({ uuid, name, category, geoLocation, providersId }: CryptoEstablishmentBaseApi): BaseEstablishment {
    const parsedEstablishment: BaseEstablishment = {
      uuid: uuid.trim(),
      name: name.trim(),
      category: category.trim(),
      geoLocation,
      providers: providersId.map((id) => providers.value.get(id)).filter(Boolean) as Provider[],
      hasAllInfo: false,
    }
    return parsedEstablishment
  }

  function parseEstablishment({
    uuid, address, providers: providersWithCrypto, category, gmapsPlaceId, geoLocation, name, photoReference, rating, gmapsTypes
  }: CryptoEstablishmentApi): Establishment {
    const photoUrl = photoReference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=540&photo_reference=${photoReference}&key=${googleMapsKey}`
      : undefined


    const establishmentProviders = providersWithCrypto.map(p => {
      const provider = providers.value.get(p.id)
      if (!provider) {
        console.error(`Provider ${p.id} not found in providers map`)
        return
      }
      const establishmentProvider: Establishment["providers"][number] = { ...provider, buy: p.buy || [], sell: p.sell || [] }
      return establishmentProvider
    }).filter(Boolean) as Establishment["providers"]

    const parsedEstablishment: Establishment = {
      hasAllInfo: true,
      address: address.trim(),
      category: category.trim(),
      gmapsPlaceId: gmapsPlaceId.trim(),
      gmapsTypes,
      gmapsUrl: `https://maps.google.com/?cid=${gmapsPlaceId.trim()}`,
      geoLocation,
      uuid: uuid.trim(),
      name: name.trim(),
      photoUrl: photoUrl?.trim(),
      rating: rating,
      providers: establishmentProviders
    }
    return parsedEstablishment
  }

  async function search() {
    const { establishments } = storeToRefs(useEstablishments())

    const { northEast, southWest } = surroundingBoundingBox.value
    console.log(`https://www.google.com/maps/@${northEast.lat},${northEast.lng},17z`)
    const boundingBoxStr = `${southWest.lng},${southWest.lat},${northEast.lng},${northEast.lat}`

    const body: SearchEstablishmentsRequest = {
      filterBoundingBox: boundingBoxStr,
      filterEstablishmentCategoryLabel: selectedFilters.value.categories.map(c => c.label) || undefined,
      filterCurrency: selectedFilters.value.currencies.map(c => c.symbol) || undefined,
    }

    const unformattedResponse: { [key: string]: CryptoEstablishmentBaseApi }[] = await establishmentsApi.searchEstablishments(body).catch((e) => e)
    console.log('🔍 Got establishments from API: ', unformattedResponse)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore The API is returning an object with the index as key, but it should return an array
    const response = Object.values(unformattedResponse) as CryptoEstablishmentBaseApi[]

    if (response instanceof Error) {
      console.error(response);
      // alert('The api is not available'); // TODO Handle error
      return;
    }

    response
      .map(parseBaseEstablishment)
      .sort((a, b) => b.geoLocation.lat - a.geoLocation.lat)
      .filter((e) => !establishments?.value.has(e.uuid)) // ignore already loaded establishments
      .forEach((establishment) => establishments?.value.set(establishment.uuid, establishment))
  }

  async function getEstablishmentByUuid(uuid: string) {
    if (!uuid) return
    const { establishments } = storeToRefs(useEstablishments())

    const rawEstablishment = await establishmentsApi.getEstablishmentByUuid({ uuid }).catch((e) => e)
    const establishment = parseEstablishment(rawEstablishment) || undefined
    console.log(`🔍 Got establishment with uuid ${uuid} from API: `, establishment)

    establishment.hasAllInfo = true
    establishments.value.set(uuid, establishment)

    return establishment
  }

  function setEstablishment(establishment: Establishment) {
    const { establishments } = storeToRefs(useEstablishments())

    // check that the establishment is not already in the map
    if (establishments.value.get(establishment.uuid)?.hasAllInfo) {
      return
    }

    establishments.value.set(establishment.uuid, establishment)
  }

  async function fetchIssueCategories() {
    const res: CategoriesIssue[] = await establishmentsApi.getIssueCategories().catch((e) => e)
    console.log('🔍 Fetched issue categories from the API', res)
    if (res instanceof Error) {
      console.error(res);
      // TODO Handle error
      return;
    }
    categoriesIssue.value = res.map(({ id, label }) => ({
      id,
      label,
    }))
  }

  async function fetchCategories() {
    const res: Category[] = await establishmentsApi.getCategories().catch((e) => e)
    console.log('🔍 Fetched categories from the API', res)
    if (res instanceof Error) {
      console.error(res);
      // TODO Handle error
      return;
    }
    res.forEach((category) => {
      categories.value.set(category.label, { id: category.id, label: category.label })
    })
  }

  async function fetchCurrencies() {
    const res: Currency[] = await establishmentsApi.getCurrencies().catch((e) => e)
    console.log('🔍 Fetched currencies from the API', res)
    if (res instanceof Error) {
      console.error(res);
      // TODO Handle error
      return;
    }

    const showFirst = ['NIM', 'BTC']
    const showLast = ['atm']

    const sortedCurrencies = res.sort((a, b) => {
      const aIndex = showFirst.indexOf(a.symbol)
      const bIndex = showFirst.indexOf(b.symbol)
      const aLastIndex = showLast.indexOf(a.symbol)
      const bLastIndex = showLast.indexOf(b.symbol)

      if (aIndex > -1 && bIndex > -1) return aIndex - bIndex
      if (aIndex > -1) return -1
      if (bIndex > -1) return 1
      if (aLastIndex > -1 && bLastIndex > -1) return aLastIndex - bLastIndex
      if (aLastIndex > -1) return 1
      if (bLastIndex > -1) return -1
      return 0
    })

    sortedCurrencies.forEach((currency) => {
      currencies.value.set(currency.symbol, currency)
    })
  }

  async function fetchProviders() {
    const res: Provider[] = await establishmentsApi.getProviders().catch((e) => e)
    console.log('🔍 Fetched providers from the API', res)
    if (res instanceof Error) {
      console.error(res);
      // TODO Handle error
      return;
    }
    res.forEach((provider) => {
      providers.value.set(provider.id, provider)
    })
  }

  function pathParamToStringList(param: 'currencies' | 'categories') {
    const values = route.query[param] as string

    if (!values) return []
    if (typeof values === 'string') return [values]
    return values
  }

  function extractFromMap<T>(map: Map<string, T>, list: string[]): T[] {
    return list.map(item => map.get(item)!).filter(Boolean)
  }

  watch([boundingBox], async () => await search())

  async function reportEstablishment(establishmentIssueBody: EstablishmentIssueRequest["establishmentIssueBody"]) {
    await establishmentsApi.postEstablishmentIssue({ establishmentIssueBody })
  }

  async function addCandidate(establishmentCandidateBody: CandidateRequest["establishmentCandidateBody"]) {
    await establishmentsApi.postCandidate({ establishmentCandidateBody })
  }

  onMounted(async () => {
    await Promise.all([
      fetchProviders(),
      fetchCategories(),
      fetchCurrencies()
    ])

    selectedFilters.value = {
      currencies: extractFromMap(currencies.value, pathParamToStringList('currencies')),
      categories: extractFromMap(categories.value, pathParamToStringList('categories'))
    };
  })

  const suggestions = ref<Suggestion[]>([])
  async function autocomplete(query: string) {
    const res = await establishmentsApi.autocomplete({ query })
    const establishments: Suggestion[] = res.establishments.map((e) => ({
      label: e.name,
      id: e.uuid,
      matchedSubstrings: [],
      type: SuggestionType.API,
      apiSuggestion: 'establishment'
    }))
    const currencies: Suggestion[] = res.currencies.map((c) => ({
      label: c.name,
      id: c.symbol,
      matchedSubstrings: [],
      type: SuggestionType.API,
      apiSuggestion: 'currency'
    }))
    const categories: Suggestion[] = res.categories.map((c) => ({
      label: c.label,
      id: c.label,
      matchedSubstrings: [],
      type: SuggestionType.API,
      apiSuggestion: 'category'

    }))

    suggestions.value = [...establishments, ...currencies, ...categories]
  }

  return {
    search,
    categories,
    currencies,
    categoriesIssue,
    fetchIssueCategories,
    selectedFilters,
    getEstablishmentByUuid,
    setEstablishment,
    reportEstablishment,
    addCandidate,
    autocomplete,
    suggestions
  }
})
