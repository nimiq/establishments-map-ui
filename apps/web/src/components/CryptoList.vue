<script setup lang="ts">
import { Currency } from 'types'

const props = withDefaults(
  defineProps<{ location: MapLocation, progress?: number, max?: number /* Max number of cryptos to display. If more, display a "+n" at the end */ }>(),
  { progress: 1, max: 3 },
)

function arrayEquals(arrA: string[], arrB: string[]): boolean {
  return arrA.length === arrB.length && arrA.every((value, index) => value === arrB[index])
}

const accepts = computed(() => props.location.accepts)
const sells = computed(() => props.location.sells)
const acceptToDisplay = computed(() => accepts.value.length <= props.max ? accepts.value : accepts.value.slice(0, props.max))
const sellToDisplay = computed(() => sells.value.length <= props.max ? sells.value : sells.value.slice(0, props.max))

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{ cryptosToDisplay: Currency[], n: number }>()
</script>

<template>
  <DefineTemplate v-slot="{ cryptosToDisplay, n }">
    <ul
      v-if="cryptosToDisplay.length > 0" flex="~ items-center gap-x-8" absolute bottom-0 z-20 w-max rounded-full
      bg-neutral-0 p-4 ring="~ 1.5 neutral/15"
    >
      <li v-for="c in cryptosToDisplay " :key="c">
        <div v-if="c !== Currency.BINANCE_PAY" text-24 :class="getCurrencyIcon(c)" :title="translateCurrency(c)" />
        <PopoverRoot v-else>
          <PopoverTrigger aria-label="Binance Pay" flex>
            <div i-cryptocurrency-color:btc relative text-24>
              <div absolute bottom--1 right--1 rounded-full bg-neutral-0>
                <div text="12 neutral-600" i-nimiq:info />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverPortal>
            <PopoverContent
              z-200 max-w-320 rounded-6 p-16 text-white bg-gradient-neutral shadow ring="1.5 neutral/3"
              :side="isMobile ? 'top' : 'right'" :collision-padding="8" :side-offset="6"
            >
              <h4 font-semibold lh-none text="15 neutral-100">
                {{ $t('NAKA supports Binance Pay') }}
              </h4>

              <p text="12 neutral-500" mt-8>
                {{
                  $t(`Binance Pay is a cryptocurrency payment service that empowers users to pay with crypto at shops and
                establishments supporting Binance Pay.`)
                }}
              </p>

              <div flex="~ items-end justify-end gap-x-6" mt-12 :title="$t('BTC +50')">
                <div i-cryptocurrency-color:btc text-24 />
                <span text="14 neutral-700" font-bold>50+</span>
              </div>

              <PopoverArrow as-child>
                <div aria-hidden i-nimiq:tooltip-triangle h-8 w-16 rotate-180 text-neutral />
              </PopoverArrow>
            </PopoverContent>
          </PopoverPortal>
        </PopoverRoot>
      </li>
      <li v-if="n > 0" pr-4 text="14 neutral-700">
        +{{ n }}
      </li>
    </ul>
  </DefineTemplate>

  <transition
    enter-active-class="transition duration-100 ease-out" enter-from-class="transform translate-y-3 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-75 ease-out"
    leave-from-class="transform opacity-100" leave-to-class="transform translate-y-3 opacity-0"
  >
    <div
      v-if="progress > 0.5 && location.accepts.length && location.sells.length && !arrayEquals(location.accepts, location.sells)"
      grid="~ flow-col cols-[fit-content,fit-content] rows-[fit-content,1fr] gap-y-1 gap-x-2" relative z-20 size-max
    >
      <h5 text="13 white/60 inverted:white/90">
        {{ $t('Buy') }}
      </h5>
      <ReuseTemplate :cryptos-to-display="location.sells" :n="location.sells.length - sellToDisplay.length" />
      <h5 text="13 white/60 inverted:white/90">
        {{ $t('Sell') }}
      </h5>
      <ReuseTemplate :cryptos-to-display="location.accepts" :n="location.accepts.length - acceptToDisplay.length" />
    </div>
    <ReuseTemplate
      v-else :cryptos-to-display="[...new Set(acceptToDisplay)]" relative z-20
      :n="location.accepts.length - acceptToDisplay.length"
    />
  </transition>
</template>
