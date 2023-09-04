import { useRouteQuery } from '@vueuse/router'
import { CATEGORIES, CURRENCIES } from 'database'
import { defineStore } from 'pinia'
import type { Category, Currency } from 'types'
import { computed } from 'vue'

export const useFilters = defineStore('filters', () => {
  const selectedCategoriesQuery = useRouteQuery<Category | Category[]>('categories')
  const selectedCategories = computed(() => {
    const c = selectedCategoriesQuery.value
    if (!c)
      return []
    const categoriesArray = Array.isArray(c) ? c : [c]
    return categoriesArray.filter(category => CATEGORIES.includes(category))
  })
  const selectedCurrenciesQuery = useRouteQuery<Currency | Currency[]>('currencies')
  const selectedCurrencies = computed(() => {
    const c = selectedCurrenciesQuery.value
    if (!c)
      return []
    const currenciesArray = Array.isArray(c) ? c : [c]
    return currenciesArray.filter(currency => CURRENCIES.includes(currency))
  })

  function setSelectedCurrencies(currencies: Currency[]) {
    selectedCurrenciesQuery.value = currencies
  }

  function setSelectedCategories(categories: Category[]) {
    selectedCategoriesQuery.value = categories
  }

  return {
    selectedCategories,
    selectedCurrencies,
    setSelectedCurrencies,
    setSelectedCategories,
  }
})
