import { categories, currencies, type Category, type Currency, } from '@/database';
import { useRouteQuery } from '@vueuse/router';
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useLocations } from '@/stores/locations';
import { useMap } from "./map";

export const useApp = defineStore("app", () => {
  const listIsShown = ref(false);
  const toggleList = () => listIsShown.value = !listIsShown.value;
  const showList = () => listIsShown.value = true;
  const hideList = () => listIsShown.value = false;

  // TODO Do we need to store this in the store?
  const selectedLocationUuid = useRouteQuery('e')
  const selectedCategoriesQuery = useRouteQuery<Category | Category[]>('categories')
  const selectedCategories = computed(() => {
    const c = selectedCategoriesQuery.value
    if (!c) return []
    const categoriesArray = Array.isArray(c) ? c : [c]
    return categoriesArray.filter((category) => categories.includes(category));
  })
  const selectedCurrenciesQuery = useRouteQuery<Currency | Currency[]>('currencies')
  const selectedCurrencies = computed(() => {
    const c = selectedCurrenciesQuery.value
    if (!c) return []
    const currenciesArray = Array.isArray(c) ? c : [c]
    return currenciesArray.filter((currency) => currencies.includes(currency));
  })

  function setSelectedCurrencies(currencies: Currency[]) {
    selectedCurrenciesQuery.value = currencies
  }

  function setSelectedCategories(categories: Category[]) {
    selectedCategoriesQuery.value = categories
  }

  const mapStore = useMap();
  const { computeBoundingBox } = mapStore;

  const { setCenter, setZoom } = useMap();

  async function goToLocation(uuid: string, options?: { behaviourList?: 'show' | 'hide' }) {
    const location = useLocations().Locations.get(uuid)
    if (!location) return false

    setCenter({ lng: location.lng, lat: location.lat })
    setZoom(19)
    selectedLocationUuid.value = uuid
    if (options?.behaviourList === 'show') showList()
    if (options?.behaviourList === 'hide') hideList()
    computeBoundingBox({ updateRoute: false })
    return true
  }

  return {
    listIsShown,
    toggleList,
    showList,
    hideList,
    selectedLocationUuid,
    goToLocation,
    selectedCategories,
    selectedCurrencies,
    setSelectedCurrencies,
    setSelectedCategories,
  }
});
