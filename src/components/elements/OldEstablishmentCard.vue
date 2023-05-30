<script setup lang="ts">
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import Popover from "@/components/elements/Popover.vue"
import FlagIcon from "@/components/icons/icon-flag.vue"
import ShareIcon from "@/components/icons/icon-share.vue"
import StarIcon from "@/components/icons/icon-star.vue"
import EstablishmentPlaceholder from "@/components/illustrations/establishment-placeholder.vue"

import type { CurrencyInner } from "@/api"
import { useBreakpoints } from "@/composables/useBreakpoints"
import { useApi } from "@/stores/api"
import { useApp } from "@/stores/app"
import { computed, onMounted, ref } from "vue"
import { RouterLink } from "vue-router"
import type { BaseEstablishment, Establishment } from "@/stores/establishments"

const card$ = ref<(BaseEstablishment | Establishment) & { $el: HTMLElement } | null>(null)

const props = defineProps<{
  establishment: Establishment | BaseEstablishment
}>()

const hasAllInfo = computed(() => props.establishment.hasAllInfo)

const { getEstablishmentByUuid, setEstablishment } = useApi()

// make an observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting && !hasAllInfo.value) {
      const establishment = await getEstablishmentByUuid(props.establishment.uuid)
      if (!establishment) return
      setEstablishment(establishment)
    }
  })
})

const container = ref<HTMLElement>();
onMounted(() => {
  container.value = document.querySelector('#list') as HTMLElement
  if (!card$.value) return
  observer.observe(card$.value.$el)
})

// const showBluecode = computed(() => props.establishment.currencies.map(c => c.symbol).includes('bluecode'))
// const showAtm = computed(() => props.establishment.currencies.map(c => c.symbol).includes('atm'))

function specialCurrency(id: string | number) {
  return ["bluecode", "atm"].includes(id as string)
}

const canShare = computed(() => {
  return "share" in navigator
})

function shareEstablishment(establishment: BaseEstablishment | Establishment) {
  navigator.share({
    title: `${establishment.name} | Crypto Map by Nimiq`,
    text: `Check out ${establishment.name} on Crypto Map by Nimiq!`,
    url: `${window.location.origin}/establishment/${establishment.uuid}`
  })
}

const { smaller } = useBreakpoints()
function onClick() {
  const isSmall = smaller('xl')
  if (!isSmall.value) return
  useApp().hideList()
}
</script>

<template>
  <template v-if="hasAllInfo">
    <RouterLink :to="`/establishment/${establishment.uuid}`" @click="onClick" class="bg-white children:px-6" ref="card$">
      <img v-if="establishment.hasAllInfo" :src="establishment.photoUrl" :alt="`Image of ${establishment.name}`"
        class="h-36 object-cover w-full !px-1.5 rounded-sm" loading="lazy" />

      <div v-else class="
          w-full
          h-36
          flex flex-col
          bg-space/[0.06]
          items-center
          justify-center
          text-space
          gap-4
        ">
        <EstablishmentPlaceholder class="w-12 h-12" />
        <h4 class="text-lg font-bold">{{ $t("No_photo_available") }}</h4>
      </div>

      <h2 class="flex-1 mt-5 text-lg font-bold text-space">
        {{ establishment.name }}
      </h2>

      <p class="flex items-center mt-2 text-sm">
        <!-- <span class="capitalize text-space/60">{{
          establishment.gmapsType
        }}</span> -->
        <span class="capitalize text-space/60">Gmaps Type</span>
        <template v-if="establishment.hasAllInfo">
          <StarIcon class="ml-2 text-gold" style="width: 13px; height: 13px" />
          <span class="ml-1 font-bold">{{ establishment.rating }}</span>
        </template>
      </p>

      <p class="text-sm text-space/60" :class="{ pulse: hasAllInfo }">
        <!-- TODO check this behaviour -->
        {{ establishment.hasAllInfo ? establishment.address : '' }}
      </p>
    </RouterLink>

    <ul class="flex px-6 pb-6 mt-4 bg-white gap-x-1">
      <!-- <li v-for="{ symbol } in leaveOutSpecialCurrency(
        establishment.currencies
      )" :key="symbol" class="w-6 h-6 rounded-full">
        <CryptoIcon :crypto="symbol.toLowerCase()" />
      </li> -->

      <!-- <div v-if="establishment.currencies.filter(c => c.symbol !== 'atm').length > 0
        && (showBluecode || showAtm)" class="w-px h-6 mx-3 bg-space/20" /> -->

      <!-- <li v-if="showBluecode">
        <Popover cta-href="https://bluecode.com/de-de/" :container="container">
          <template #trigger>
            <CryptoIcon crypto="bluecode" class="w-[14px] h-[22px]" />
          </template>
          <template #subline> {{ $t('Coming_soon') }}</template>
          <template #title> {{ $t('Nimiq_for_Bluecode') }} </template>
          <template #description> {{ $t('A_mobile_app_for_paying_with_NIM_at_Bluecode_acceptance_locations') }}
          </template>
          <template #cta> {{ $t('Learn more') }} </template>
          ets
        </Popover>
      </li> -->

      <!-- <li v-if="showAtm">
        <Popover :container="container">
          <template #trigger>
            <CryptoIcon class="w-6 h-5" crypto="atm" />
          </template>
          <template #title> {{ $t('Crypto_ATM') }}</template>
          <template #description>{{ $t('A_Crypto_ATM_is_a_machine_that_allows_customers') }}</template>
        </Popover>
      </li> -->
    </ul>

    <hr class="bg-space/20 h-0.5" />

    <div class="flex items-end flex-1 px-6 mt-4 bg-white gap-x-2">
      <a v-if="establishment.hasAllInfo" :href="establishment.gmapsUrl" target="_blank" class="
          z-1
          flex-1
          bg-ocean
          hover:bg-ocean/90
          focus-visible:bg-ocean/90
          transition-colors
          shadow
          rounded-full
          py-[5px]
          h-max
          text-white
          font-bold
          text-center
        ">
        Google Maps
      </a>

      <RouterLink :to="`/establishment/${establishment.uuid}/report`" class="
          z-1
          bg-cherry
          hover:bg-cherry/80
          focus-visible:bg-cherry/80
          transition-colors
          shadow
          rounded-full
          text-center
          w-[35px]
          py-[7.5px]
          h-max
        ">
        <FlagIcon class="mx-auto text-white" />
      </RouterLink>

      <button v-if="canShare" @click="shareEstablishment(establishment)" class="
          z-1
          bg-space/[0.07]
          hover:bg-space/10
          focus-visible:bg-space/10
          transition-colors
          rounded-full
          text-center
          w-[35px]
          py-[7.5px]
          h-max
        ">
        <ShareIcon class="mx-auto text-space" />
      </button>
    </div>
  </template>
  <template v-else>
    <RouterLink :to="`/establishment/${establishment.uuid}`" class="bg-white children:px-6" ref="card$">
      <div class="
          h-36
          w-[calc(100%-12px)]
          rounded-sm
          bg-space/[0.06]
          animate-pulse
          !mx-1.5
        " />

      <h2 class="flex-1 mt-5 text-lg font-bold text-space">
        {{ establishment.name }}
      </h2>

      <div class="flex h-5 mt-2 gap-x-2">
        <div class="w-20 bg-space/[0.06] animate-pulse rounded-sm"></div>
        <div class="w-8 bg-space/[0.06] animate-pulse rounded-sm"></div>
      </div>

      <div class="flex h-5 mt-1 gap-x-2">
        <div class="w-10 bg-space/[0.06] animate-pulse rounded-sm"></div>
        <div class="w-6 bg-space/[0.06] animate-pulse rounded-sm"></div>
        <div class="w-12 bg-space/[0.06] animate-pulse rounded-sm"></div>
        <div class="w-20 bg-space/[0.06] animate-pulse rounded-sm"></div>
      </div>

      <div class="flex pb-6 mt-4 gap-x-1">
        <div class="w-6 h-6 rounded-full bg-space/[0.06] animate-pulse"></div>
        <div class="w-6 h-6 rounded-full bg-space/[0.06] animate-pulse"></div>
        <div class="w-6 h-6 rounded-full bg-space/[0.06] animate-pulse"></div>
        <div class="w-6 h-6 rounded-full bg-space/[0.06] animate-pulse"></div>
      </div>
    </RouterLink>

    <hr class="bg-space/20 h-0.5" />

    <div class="flex items-end flex-1 px-6 mt-4 bg-white gap-x-2">
      <div class="flex-1 h-[35px] rounded-full bg-space/[0.06] animate-pulse"></div>
      <div class="w-[35px] h-[35px] rounded-full bg-space/[0.06] animate-pulse"></div>
    </div>
  </template>
</template>
