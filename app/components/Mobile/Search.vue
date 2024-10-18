<script setup lang="ts">
const autocomplete = Object.values(Autocomplete)
const { query, status, googleSuggestions, locationSuggestions } = useAutocomplete({ autocomplete })
const open = defineModel < boolean > ('open')
open.value = query.value !== ''

// See https://github.com/radix-vue/radix-vue/issues/877
watch(query, (newQuery, oldQuery) => {
  if (!!oldQuery && newQuery === '')
    query.value = oldQuery
}, { once: true })

function reset() {
  if (query.value === '')
    return
  query.value = ''
  open.value = false
}
</script>

<template>
  <Transition name="fade">
    <ComboboxRoot v-if="open" v-model:search-term="query" @update:model-value="reset">
      <ComboboxAnchor flex="~ items-center justify-between" group relative border-b="1.5 neutral-500 focus-within:blue">
        <!-- :placeholder="$t('Search Map')" -->
        <ComboboxInput
          placeholder="Search Map"
          auto-focus order-2 w-full rounded-0 py-16 pr-48 text-14 font-semibold shadow-none outline-none nq-input-box
        />
        <!-- :aria-label="$t('Go back')" -->
        <ComboboxTrigger
          aria-label="Go back" pl-16 nq-arrow-back text="16  neutral-700 group-focus-within:blue/80"
          @click="open = false"
        />
        <ComboboxCancel
          i-nimiq:cross absolute right-24 op-0 :class="query === '' ? 'op-0' : 'op-100'"
          transition-opacity delay-500 text="10  neutral-700 group-focus-within:blue/80"
        />
      </ComboboxAnchor>
      <SearchSuggestions :status :google-suggestions :location-suggestions top-55 mt-16 />
    </ComboboxRoot>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms var(--nq-ease);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
