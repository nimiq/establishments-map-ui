<script setup lang="ts">
import type { PropType } from 'vue'
import { Currency } from 'types'
import { useBreakpoints } from '@vueuse/core'
import { breakpointsTailwind } from '@vueuse/core'
import { Popover } from 'radix-vue/namespaced'
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
import InfoIcon from '@/components/icons/icon-info.vue'

const props = defineProps({
  crypto: {
    type: String as PropType<Currency>,
    required: true,
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg',
  },
  bg: {
    type: String as () => 'white' | 'white/15' | 'transparent',
    default: 'transparent',
  },
})

const needBg = [Currency.ETH, Currency.XRP, Currency.XLM].includes(props.crypto)

const css: string = needBg ? 'rounded-full ring-neutral-100' : ''

const isMobile = useBreakpoints(breakpointsTailwind).smaller('md')
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
    }" :title="crypto !== Currency.BINANCE_PAY ? crypto : undefined"
  >
    <NimIcon v-if="crypto === Currency.NIM" :class="css" />
    <BtcIcon v-else-if="crypto === Currency.BTC" :class="css" />
    <LtcIcon v-else-if="crypto === Currency.LTC" :class="css" />
    <EthIcon v-else-if="crypto === Currency.ETH" :class="css" />
    <XrpIcon v-else-if="crypto === Currency.XRP" :class="css" />
    <DashIcon v-else-if="crypto === Currency.DASH" :class="css" />
    <XlmIcon v-else-if="crypto === Currency.XLM" :class="css" />
    <UsdcIcon v-else-if="crypto === Currency.USDC_on_POLYGON" :class="css" />
    <BchIcon v-else-if="crypto === Currency.BCH" :class="css" />
    <div v-else-if="crypto === Currency.LBTC" class="relative">
      <BtcIcon :class="css" />
      <LBtcIcon class="absolute w-4 -right-1 -bottom-1" />
    </div>
    <Popover.Root v-else-if="crypto === Currency.BINANCE_PAY">
      <Popover.Trigger>
        <div class="relative">
          <BtcIcon :class="css" class="w-6" />
          <InfoIcon
            class="absolute -right-px -bottom-px w-3 [&>[data-info-bg]]:fill-white [&>[data-info-circle]]:text-[#c7c8d1] [&>[data-info-i]]:text-[#8f91a3]"
          />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          class="max-w-320 p-4 space-y-2 text-white rounded-sm shadow z-100 bg-gradient-space"
          :side="isMobile ? 'top' : 'right'" :collision-padding="8" :side-offset="6"
        >
          <h4 class="font-semibold truncate">
            {{ $t('GoCrypto supports Binance Pay') }}
          </h4>

          <p class="mt-2 text-14 text-white/60 text-pretty">
            {{
              $t(`Binance Pay is a cryptocurrency payment service that empowers users to pay with crypto at shops and
            establishments supporting Binance Pay.`)
            }}
          </p>

          <div class="flex items-end justify-end gap-x-1.5" :title="$t('BTC +50')">
            <BtcIcon :class="css" class="w-6" />
            <span class="text-14 font-bold text-white/50">50+</span>
          </div>

          <Popover.Arrow class="fill-space" size="8" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  </div>
</template>
