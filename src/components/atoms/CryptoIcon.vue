<script setup lang="ts">
import BtcIcon from '@/components/icons/cryptos/icon-btc.vue'
import DashIcon from '@/components/icons/cryptos/icon-dash.vue'
import EthIcon from '@/components/icons/cryptos/icon-eth.vue'
import LBtcIcon from '@/components/icons/cryptos/icon-lbtc.vue'
import LtcIcon from '@/components/icons/cryptos/icon-ltc.vue'
import NimIcon from '@/components/icons/cryptos/icon-nim.vue'
import XlmIcon from '@/components/icons/cryptos/icon-xlm.vue'
import XrpIcon from '@/components/icons/cryptos/icon-xrp.vue'

const props = defineProps({
  crypto: {
    type: String,
    required: true,
  },
  mono: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg',
  },
  bg: {
    type: String as () => 'white' | 'white/15' | 'transparent',
    default: 'transparent',
  },
})
const crypto = props.crypto.toLocaleLowerCase()

const styles = props.mono
  ? { '--bg': 'transparent', '--brandmark': 'rgba(255, 255, 255)' }
  : {}

const needBg = ['eth', 'xrp', 'xlm'].includes(crypto)

const css: string = !props.mono && needBg ? 'ring-1 rounded-full ring-space/10' : ''
</script>

<template>
  <div
    class="flex items-center justify-center h-full aspect-square" :class="{
      'rounded-full': 'mono',
      'w-8': size === 'lg',
      'w-[22px]': size === 'sm',
      'w-6': size === 'md',
      'bg-white/[0.15]': bg === 'white/15',
      'bg-white': bg === 'white' && needBg,
    }"
  >
    <NimIcon v-if="crypto === 'nim'" :class="css" :style="[styles, { width: mono && '22px' }]" />
    <BtcIcon v-else-if="crypto === 'btc'" :class="css" :style="[styles, { width: mono && '28px' }]" />
    <LtcIcon v-else-if="crypto === 'ltc'" :class="css" :style="[styles, { width: mono && '20px' }]" />
    <EthIcon v-else-if="crypto === 'eth'" :class="css" :style="[styles, { width: mono && '22px' }]" />
    <XrpIcon v-else-if="crypto === 'xrp'" :class="css" :style="[styles, { width: mono && '26px' }]" />
    <DashIcon v-else-if="crypto === 'dash'" :class="css" :style="[styles, { width: mono && '26px' }]" />
    <XlmIcon v-else-if="crypto === 'xlm'" :class="css" :style="[styles, { width: mono && '28px' }]" />
    <LBtcIcon v-else-if="crypto === 'lbtc'" :class="css" :style="[styles, { width: mono && '28px' }]" />
  </div>
</template>
