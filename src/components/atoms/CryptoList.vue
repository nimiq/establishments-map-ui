<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { Currency } from 'types'
import CryptoIcon from '@/components/icons/cryptos/CryptoIcon.vue'

const props = defineProps({
  cryptos: {
    type: Array as PropType<Currency[]>,
    default: () => [],
  },
  label: {
    type: String,
  },
  // max number of cryptos to display. If more, display a "+n" at the end
  max: {
    type: Number,
    default: 3,
  },
})

const cryptosToDisplay = computed(() => {
  const max = props.max
  const cryptos = props.cryptos
  if (cryptos.length <= max)
    return cryptos

  else
    return cryptos.slice(0, max)
})

const n = computed(() => {
  return props.cryptos.length - cryptosToDisplay.value.length
})
</script>

<template>
  <div v-if="cryptosToDisplay.length > 0" class="flex items-center gap-x-2">
    <ul class="flex items-center p-1 bg-white rounded-full w-max gap-x-2 ring-1 ring-space/10">
      <li v-for="c in cryptosToDisplay " :key="c">
        <CryptoIcon :crypto="c" size="md" bg="transparent" />
      </li>
      <li v-if="n > 0" class="pr-1 text-sm text-space/60">
        +{{ n }}
      </li>
    </ul>
  </div>
</template>
