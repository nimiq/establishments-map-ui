<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { breakpointsTailwind } from '@vueuse/core'
import { CATEGORIES, CURRENCIES } from 'database'
import type { Category, Currency } from 'types'
import Button from '@/components/atoms/Button.vue'
import CryptoIcon from '@/components/icons/cryptos/CryptoIcon.vue'
import Select from '@/components/atoms/Select.vue'
import FilterIcon from '@/components/icons/icon-filter.vue'
import { useFilters } from '@/stores/filters'
import { translateCategory, translateCurrency } from '@/translations'
import { useMarkers } from '@/stores/markers'
import Modal from '@/components/atoms/Modal.vue'
import { getCategoryIcon } from '@/composables/useIcon'

const open = ref(false)
const isMobile = useBreakpoints(breakpointsTailwind).smaller('md')

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

function updateFilters() {
  filtersStore.setSelectedCategories(unappliedFiltersCategories.value)
  filtersStore.setSelectedCurrencies(unappliedFiltersCurrencies.value)
  useMarkers().cluster()
}

function clearFilters() {
  unappliedFiltersCategories.value = []
  unappliedFiltersCurrencies.value = []
  updateFilters()
}

function closeModal({ shouldClearFilters }: { shouldClearFilters: boolean }) {
  if (shouldClearFilters)
    clearFilters()

  open.value = false
}

function applyFilters() {
  updateFilters()
  closeModal({ shouldClearFilters: false })
}
</script>

<template>
  <!-- <Modal v-bind="$attrs" v-model="open" @close="closeModal({ shouldClearFilters: false })">
    <template #trigger>
      <Button bg-color="white" as="div" class="max-desktop:px-0 border animate-scale border-[#e9e9ed]">
        <template #icon>
          <FilterIcon class="w-4 text-space" />
        </template>
        <template v-if="!isMobile" #label>
          {{ $t('Filters') }}
        </template>
        <template v-if="nFilters > 0" #badge>
          {{ nFilters }}
        </template>
      </Button>
    </template>
    <template #title>
      {{ $t('Filters') }}
    </template>
    <template #content="{ Separator }">
      <component :is="Separator" />

      <Select
        v-model="unappliedFiltersCurrencies" :placeholder="$t('Select Cryptocurrency')"
        :options="CURRENCIES"
      >
        <template #label>
          <h3 class="mb-6 text-14 font-semibold tracking-wider uppercase text-space/40 md:mb-8">
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
        :placeholder="$t('Select category')" class="mt-9"
      >
        <template #label>
          <h3 class="mb-6 text-14 font-semibold tracking-wider uppercase text-space/40 md:mb-8">
            {{ $t('Categories') }}
          </h3>
        </template>
        <template #option="{ option: category }">
          <div :class="getCategoryIcon(category)" text-24 />
          {{ translateCategory(category) }}
        </template>
        <template #selected-option="{ option: category }">
          {{ translateCategory(category) }}
        </template>
      </Select>

      <component :is="Separator" />

      <div class="flex justify-between">
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
    </template>
  </Modal> -->

  <!-- <div>
    <Button bg-color="white" class="max-desktop:px-0" @click="openModal">
      <template #icon>
        <FilterIcon class="w-4 text-space" />
      </template>
      <template v-if="!isMobile" #label>
        {{ $t('Filters') }}
      </template>
      <template v-if="nFilters > 0" #badge>
        {{ nFilters }}
      </template>
    </Button>
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
              as="template"
              enter="duration-300 ease-out"
              leave="duration-200 ease-in"
              :enter-from="`${isMobile ? 'translate-y-full' : ''} opacity-0 scale-95`"
              :enter-to="`${isMobile ? 'translate-y-0' : ''} opacity-100 scale-100`"
              :leave-from="`${isMobile ? 'translate-y-0' : ''} opacity-100 scale-100`"
              :leave-to="`${isMobile ? 'translate-y-full' : ''} opacity-0 scale-95`"
            >
              <DialogPanel
                class="relative w-full py-8 text-left align-middle transition-all transform bg-white shadow-lg rounded-t-2xl md:max-w-512 md:rounded-lg"
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
                    <h3 class="mb-6 text-14 font-semibold tracking-wider uppercase text-space/40 md:mb-8">
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
                    <h3 class="mb-6 text-14 font-semibold tracking-wider uppercase text-space/40 md:mb-8">
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
  </div> -->
</template>
