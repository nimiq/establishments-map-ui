<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { screens } from 'tailwindcss-nimiq-theme'
import { CATEGORIES, CURRENCIES } from 'database'
import type { Category, Currency } from 'types'
import Button from '@/components/atoms/Button.vue'
import CategoryIcon from '@/components/icons/categories/CategoryIcon.vue'
import CryptoIcon from '@/components/icons/cryptos/CryptoIcon.vue'
import Select from '@/components/atoms/Select.vue'
import CrossIcon from '@/components/icons/icon-cross.vue'
import FilterIcon from '@/components/icons/icon-filter.vue'
import { useFilters } from '@/stores/filters'
import { translateCategory, translateCurrency } from '@/translations'
import { useCluster } from '@/stores/cluster'
import { useMap } from '@/stores/map'

const isOpen = ref(false)
const isMobile = useBreakpoints(screens).smaller('md')

const filtersStore = useFilters()
const { selectedCategories, selectedCurrencies } = storeToRefs(filtersStore)

const unappliedFiltersCategories = ref<Category[]>([])
const unappliedFiltersCurrencies = ref<Currency[]>([])

watchEffect(() => {
  unappliedFiltersCategories.value = [...selectedCategories.value]
})

watchEffect(() => {
  unappliedFiltersCurrencies.value = [...selectedCurrencies.value]
})

const nFilters = computed(() => {
  if (!selectedCategories || !selectedCurrencies)
    return 0
  return selectedCategories.value.length + selectedCurrencies.value.length
})

const { boundingBox, zoom } = storeToRefs(useMap())

function updateFilters() {
  filtersStore.setSelectedCategories(unappliedFiltersCategories.value)
  filtersStore.setSelectedCurrencies(unappliedFiltersCurrencies.value)

  useCluster().cluster({
    zoom: zoom.value,
    boundingBox: boundingBox.value!,
  }, {
    categories: unappliedFiltersCategories.value,
    currencies: unappliedFiltersCurrencies.value,
  })
}

function clearFilters() {
  unappliedFiltersCategories.value = []
  unappliedFiltersCurrencies.value = []
  updateFilters()
}

function closeModal({ shouldClearFilters }: { shouldClearFilters: boolean }) {
  if (shouldClearFilters)
    clearFilters()

  isOpen.value = false
}

function openModal() {
  isOpen.value = true
}

function applyFilters() {
  updateFilters()
  closeModal({ shouldClearFilters: false })
}
</script>

<template>
  <div>
    <template v-if="isMobile">
      <Button bg-color="white" size="lg" class="!w-10 h-10" @click="openModal">
        <template #icon>
          <FilterIcon class="w-6 h-6 text-space" />
        </template>
        <template v-if="nFilters > 0" #badge>
          {{ nFilters }}
        </template>
      </Button>
    </template>
    <template v-else>
      <Button bg-color="white" size="md" @click="openModal">
        <template #icon>
          <FilterIcon class="text-space w-4.5 h-4.5" />
        </template>
        <template #label>
          {{ $t('Filters') }}
        </template>
        <template v-if="nFilters > 0" #badge>
          {{ nFilters }}
        </template>
      </Button>
    </template>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" class="relative z-20" @close="closeModal({ shouldClearFilters: false })">
        <TransitionChild
          as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-space/60" />
        </TransitionChild>

        <div class="fixed inset-x-0 bottom-0 overflow-y-auto md:inset-0">
          <div class="flex items-center justify-center min-h-full text-center">
            <TransitionChild
              as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="relative w-full py-8 text-left align-middle transition-all transform bg-white shadow-lg md:max-w-lg rounded-t-8 md:rounded-lg"
              >
                <CrossIcon
                  class="absolute w-6 h-6 transition-colors rounded-full cursor-pointer top-4 right-4 bg-space/20 hover:bg-space/30 focus-visible:bg-space/30 text-white/80"
                  @click="closeModal({ shouldClearFilters: false })"
                />

                <DialogTitle as="h2" class="px-6 text-2xl font-bold text-center text-space md:px-10">
                  {{ $t('Filters') }}
                </DialogTitle>
                <hr class="w-full h-px my-8 bg-space/10">

                <Select
                  v-model="unappliedFiltersCurrencies" :placeholder="$t('Select Cryptocurrency')"
                  :options="CURRENCIES" class="px-6 md:px-10"
                >
                  <template #label>
                    <h3 class="mb-6 text-sm font-semibold tracking-wider uppercase text-space/40 md:mb-8">
                      {{ $t('Cryptocurrencies') }}
                    </h3>
                  </template>
                  <template #option="{ option: currency }">
                    <div class="flex items-center gap-x-2">
                      <CryptoIcon :crypto="currency" size="sm" bg="white" />
                      <b>{{ translateCurrency(currency) }}</b>
                    </div>
                  </template>
                  <template #after-options>
                    {{ $t('More cryptocurrencies supported in the future') }}
                  </template>
                  <template #selected-option="{ option: currency }">
                    {{ translateCurrency(currency) }}
                  </template>
                </Select>
                <Select
                  v-model="unappliedFiltersCategories" :options="CATEGORIES"
                  :placeholder="$t('Select category')" class="px-6 mt-9 md:px-10"
                >
                  <template #label>
                    <h3 class="mb-6 text-sm font-semibold tracking-wider uppercase text-space/40 md:mb-8">
                      {{ $t('Categories') }}
                    </h3>
                  </template>
                  <template #option="{ option: category }">
                    <CategoryIcon class="w-6 h-6" :category="category" />
                    {{ translateCategory(category) }}
                  </template>
                  <template #selected-option="{ option: category }">
                    {{ translateCategory(category) }}
                  </template>
                </Select>
                <hr class="w-full h-px my-8 bg-space/10">
                <div class="flex justify-between px-6 md:px-10">
                  <Button bg-color="grey" @click="closeModal({ shouldClearFilters: true })">
                    <template #label>
                      {{ $t('Clear') }}
                    </template>
                  </Button>
                  <Button bg-color="sky" gradient @click="applyFilters">
                    <template #label>
                      {{ $t('Apply filters') }}
                    </template>
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
