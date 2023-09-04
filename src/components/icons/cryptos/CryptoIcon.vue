<script setup lang="ts">
import type { PropType } from 'vue'
import { Currency } from 'types'
import BtcIcon from '@/components/icons/cryptos/icon-btc.vue'
import DashIcon from '@/components/icons/cryptos/icon-dash.vue'
import EthIcon from '@/components/icons/cryptos/icon-eth.vue'
import LBtcIcon from '@/components/icons/cryptos/icon-lbtc.vue'
import LtcIcon from '@/components/icons/cryptos/icon-ltc.vue'
import NimIcon from '@/components/icons/cryptos/icon-nim.vue'
import XlmIcon from '@/components/icons/cryptos/icon-xlm.vue'
import XrpIcon from '@/components/icons/cryptos/icon-xrp.vue'
import UsdcIcon from '@/components/icons/cryptos/icon-usdc.vue'
import BchIcon from '@/components/icons/cryptos/icon-bch.vue'

const props = defineProps({
  crypto: {
    type: String as PropType<Currency>,
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
const styles = props.mono
  ? { '--bg': 'transparent', '--brandmark': 'rgba(255, 255, 255)' }
  : {}

const needBg = [Currency.ETH, Currency.XRP, Currency.XLM].includes(props.crypto)

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
    :title="crypto.toUpperCase()"
  >
    <NimIcon v-if="crypto === Currency.NIM" :class="css" :style="[styles, { width: mono && '22px' }]" />
    <BtcIcon v-else-if="crypto === Currency.BTC" :class="css" :style="[styles, { width: mono && '28px' }]" />
    <LtcIcon v-else-if="crypto === Currency.LTC" :class="css" :style="[styles, { width: mono && '20px' }]" />
    <EthIcon v-else-if="crypto === Currency.ETH" :class="css" :style="[styles, { width: mono && '22px' }]" />
    <XrpIcon v-else-if="crypto === Currency.XRP" :class="css" :style="[styles, { width: mono && '26px' }]" />
    <DashIcon v-else-if="crypto === Currency.DASH" :class="css" :style="[styles, { width: mono && '26px' }]" />
    <XlmIcon v-else-if="crypto === Currency.XLM" :class="css" :style="[styles, { width: mono && '28px' }]" />
    <LBtcIcon v-else-if="crypto === Currency.LBTC" :class="css" :style="[styles, { width: mono && '28px' }]" />
    <UsdcIcon v-else-if="crypto === Currency.USDC_on_POLYGON" :class="css" :style="[styles, { width: mono && '28px' }]" />
    <BchIcon v-else-if="crypto === Currency.BCH" :class="css" :style="[styles, { width: mono && '28px' }]" />
  </div>
</template>
