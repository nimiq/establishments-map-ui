<script setup lang="ts">
import { Theme, providersAssets } from "@/assets-dev/provider-assets.ts";
import Button from "@/components/atoms/Button.vue";
import CryptoList from "@/components/atoms/CryptoList.vue";
import EllipsisVertical from "@/components/icons/icon-ellipsis-vertical.vue";
import GmapsPin from "@/components/icons/icon-gmaps-pin.vue";
import StarFilledIcon from "@/components/icons/icon-star-filled.vue";
import StarIcon from "@/components/icons/icon-star.vue";
import { ProviderName, type NewEstablishment } from "@/database";
import { computed, defineAsyncComponent, provide, type PropType } from 'vue';

const props = defineProps({
  establishment: {
    type: Object as PropType<NewEstablishment>,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  }
})

const ProviderBanner = defineAsyncComponent(() => import("@/components/atoms/ProviderBanner.vue"));
const showProviderBanner = computed(() => props.establishment.provider !== ProviderName.Default)
const providerAssets = computed(() => {
  return providersAssets[props.establishment.provider as ProviderName]
});

const isAtm = computed(() => {
  return props.establishment.category === 'cash'
})
const bgColor = computed(() => {
  return {
    background: providerAssets.value && [Theme.FullCardDark, Theme.FullCardLight].includes(providerAssets.value.theme) ? providerAssets.value.bg : 'white'
  }
})
</script>

<template>
  <div class="relative overflow-hidden rounded-lg duration-[--duration,0]" :style="bgColor">
    <template v-if="establishment.provider !== ProviderName.Default">
      <div v-if="isAtm"
        class="absolute rounded-t-lg right-4 bottom-4 bg-[radial-gradient(100%_75.78%_at_100%_0%,_#ffffff_0%,_rgba(255,_255,_255,_0)_100%)] opacity-20 pointer-events-none" />
      <div v-else
        class="absolute rounded-b-lg right-4 bottom-4 bg-[radial-gradient(100%_75.78%_at_100%_100%,_#ffffff_0%,_rgba(255,_255,_255,_0)_100%)] opacity-30 pointer-events-none">
      </div>


      <div v-if="isAtm"
        class="grid place-content-center absolute z-20 -right-4 -bottom-4 pointer-events-none bg-[url(@/assets/atm-provider-rings-bg.svg)] bg-no-repeat h-[118px] w-[118px]">
        <component :is="providerAssets?.icon" class="w-9 h-9" />
      </div>

      <div v-else
        class="grid place-content-center absolute z-20 -right-0.5 -bottom-1.5  pointer-events-none bg-[url(@/assets/provider-rings-bg.svg)] bg-[59px_59px] bg-no-repeat h-[186px] w-[186px]">
        <div class="absolute grid p-2 bg-white rounded-full w-9 h-9 right-4 bottom-4 place-content-center"
          style="box-shadow: 0px 12.8571px 27.1429px rgba(31, 35, 72, 0.07), 0px 5px 6.07143px rgba(31, 35, 72, 0.04), 0px 1.42857px 1.78571px rgba(31, 35, 72, 0.02)">
          <component :is="providerAssets?.icon" v-if="progress === 1" class="w-6 h-6 zoom-in" />
        </div>
      </div>

    </template>
    <div v-if="establishment.image" class="pt-1.5 px-1.5 transition-height duration-[--duration]"
      :style="`height: ${progress * 184}px;`">
      <img class="object-cover w-full h-full rounded-sm" :src="establishment.image" alt="">
    </div>

    <div class="px-6 py-5 space-y-5">
      <div class="relative grid grid-cols-[auto_1fr_max-content] gap-x-1.5 grid-rows-[repeat(3,auto)] items-center"
        :class="{
          'text-white': isAtm,
          'text-space': !isAtm,
        }">
        <h2 class="text-base font-bold leading-[1.3] col-span-2 pb-1 text-balance truncate">{{ establishment.name }}
        </h2>

        <div class="relative flex self-start row-span-2 gap-x-3">
          <Button v-if="establishment.url" bg-color="white" :href="establishment.url" border-color="grey"
            class="transition-[top,right] !w-[52px] right-0" size="sm" :style="{
              top: !isAtm && establishment.image ? `-${progress * 184}px` : '',
              position: !isAtm && establishment.image ? `absolute` : ''
            }">
            <template #icon>
              <GmapsPin />
            </template>
          </Button>

          <transition enter-active-class="right-0 transition duration-100 ease-out" enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-75 ease-out"
            leave-from-class="scale-100 opacity-100" leave-to-class="scale-95 opacity-0">
            <Button bg-color="transparent" size="sm" class="invisible ml-auto !p-0 !w-1 !h-5 clickable" :class="{
              'visible': progress > 0,
            }" :style="`width: ${progress * 4}px`">
              <template #icon>
                <EllipsisVertical class="h-5" :class="{
                  'text-white/50': providerAssets?.theme === Theme.FullCardDark,
                  'text-space/30': providerAssets?.theme !== Theme.FullCardDark,
                }" />
              </template>
            </Button>
          </transition>
        </div>

        <span class="row-start-2 text-xs font-semibold capitalize text-space/60" v-if="!isAtm">
          {{ establishment.gmapsType || establishment.category }}
        </span>
        <span class="row-start-2 text-xs text-white/70" v-else>
          <template v-if="establishment.buy.length > 0 && establishment.sell.length > 0">
            Buy & Sell crypto only*
          </template>
          <template v-else-if="establishment.buy.length > 0">
            Buy crypto only*
          </template>
          <template v-else-if="establishment.sell.length > 0">
            Sell crypto only*
          </template>
        </span>
        <div class="row-start-2 flex gap-x-0.5" v-if="!isAtm && establishment.rating">
          <template v-for="i in 5" :key="i">
            <component class="w-3 h-3" :is="i <= establishment.rating ? StarFilledIcon : StarIcon" />
          </template>
        </div>
        <p class="text-xs leading-[1.5] grid-cols-1 col-span-3 row-start-3" :class="{
          'text-white/60': isAtm,
          'text-space/70': !isAtm,
        }">
          {{ establishment.address }}
        </p>
      </div>

      <transition enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform translate-y-3 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-75 ease-out" leave-from-class="transform opacity-100"
        leave-to-class="transform translate-y-3 opacity-0">
        <template v-if="progress > 0.5 && establishment.buy.length > 0 && establishment.sell.length > 0">
          <div
            class="grid grid-flow-col grid-cols-[auto,auto] grid-rows-[auto,1fr] gap-y-1 gap-x-2 w-max h-max relative z-20">
            <h5 class="text-xs text-white/60">Buy</h5>
            <CryptoList :cryptos="establishment.buy" />
            <h5 class="text-xs text-white/60">Sell</h5>
            <CryptoList :cryptos="establishment.sell" />
          </div>
        </template>
        <template v-else>
          <CryptoList :cryptos="[...new Set(establishment.buy.concat(establishment.sell))]" class="relative z-20" />
        </template>
      </transition>
    </div>

    <ProviderBanner v-if="progress > 0 && showProviderBanner && providerAssets" :assets="providerAssets" :is-atm="isAtm"
      class="absolute w-full rounded-b-lg -mt-9"
      :style="`backgroundColor: ${!isAtm ? providerAssets.bg : 'transparent'}; opacity: ${progress / 0.8}; bottom: -${(1 - progress) * 54}px;`" />
  </div>
</template>


<style scoped>
.zoom-in {
  animation: zoomIn 400ms cubic-bezier(0.4, 0, 0.31, 1.3);
}

@keyframes zoomIn {
  0% {
    transform: scale(0)
  }

  100% {
    transform: scale(1)
  }
}
</style>
