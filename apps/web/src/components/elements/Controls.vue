<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { Popover } from 'radix-vue/namespaced'
import { useRoute } from 'vue-router'
import Button from '@/components/atoms/Button.vue'
import CryptocityCard from '@/components/cards/cryptocity/CryptocityCard.vue'
import CryptocityIcon from '@/components/icons/icon-cryptocity.vue'
import { useGeoIp } from '@/composables/useGeoLocation'
import { useCryptocities } from '@/stores/cryptocities'
import { useMap } from '@/stores/map'

const isDev = import.meta.env.DEV

const { cryptocitiesInView } = storeToRefs(useCryptocities())
const { zoom } = storeToRefs(useMap())
const cryptocityControl = computed(() => cryptocitiesInView.value.find(c => c.showCardAtZoom <= zoom.value))

const route = useRoute()

const cryptocityCardOpen = ref(false)
watch(
  [() => route.query.cryptocity, cryptocitiesInView],
  ([c]) => {
    cryptocityCardOpen.value = typeof c === 'string' && !!(cryptocitiesInView.value.some(({ name }) => name === c))
  },
  { immediate: true },
)

const isGeolocationLoading = ref(false)
const { browserPositionIsSupported, ipPosition, ipPositionError, geolocateIp, geolocateUserViaBrowser, geolocatingUserBrowser, errorBrowser } = useGeoIp()

async function setBrowserPosition() {
  isGeolocationLoading.value = true
  const browserPosition = await geolocateUserViaBrowser()
  if (errorBrowser.value) {
    /* eslint-disable-next-line no-alert */
    alert(`${errorBrowser.value.message}. Moving to closest location`)
    await geolocateIp()
    if (!ipPositionError.value && ipPosition.value)
      useMap().setPosition(ipPosition.value)
    isGeolocationLoading.value = false
    return
  }
  isGeolocationLoading.value = false
  useMap().setPosition(browserPosition)
}

function clearStorage() {
  if(!import.meta.env.DEV) return
  document.cookie.split(';').forEach(function(c) {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })
}
</script>

<template>
  <div flex="~ col items-end gap-y-16">
    <Popover.Root v-if="cryptocityControl" :open="cryptocityCardOpen"
      @update:open="$router.push({ query: { ...$route.query, cryptocity: $event ? cryptocityControl?.name : undefined } })">
      <Popover.Trigger class="border border-[#e9e9ed] animate-scale !w-8 !h-8 shadow bg-white rounded-full p-1.5"
        data-cryptocity-card-trigger :aria-label="$t('Information about this Cryptocity')">
        <CryptocityIcon />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" side="bottom" :side-offset="-32"
          class="max-desktop:-mb-[72px] max-desktop:w-screen will-change-[transform,opacity] animate-slideUpAndFade"
          @close-auto-focus.prevent @interact-outside.prevent @open-auto-focus.prevent>
          <CryptocityCard :cryptocity="cryptocityControl"
            @close="$router.push({ query: { ...$route.query, cryptocity: undefined } })" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <button size-32 shadow ring-neutral-100 rounded-full bg="neutral-0 hover:neutral-100" text-14 flex="~ items-center justify-center" 
      v-if="browserPositionIsSupported" :disabled="geolocatingUserBrowser" :aria-label="$t('Show your location')"
      :title="$t('Show your location')" @click="setBrowserPosition">
      <div i-nimiq:gps />
    </button>

    <div flex="~ col" rounded-full shadow max-desktop:hidden w-32 ring-neutral-100 text-12>
      <button size-32 rounded-t-full bg="neutral-0 hover:neutral-100" transition-colors flex="~ justify-center items-center" :aria-label="$t('Increase zoom')"
      :title="$t('Increase zoom')" @click="useMap().increaseZoom">
        <div i-nimiq:plus />
      </button>
      <hr self-stretch h-1 bg-neutral-100>
      <button size-32 rounded-b-full bg="neutral-0 hover:neutral-100" transition-colors flex="~ justify-center items-center" :aria-label="$t('Decrease zoom')"
      :title="$t('Decrease zoom')" @click="useMap().decreaseZoom">
        <div i-nimiq:minus />
      </button>
    </div>

    <div v-if="isDev" class="absolute bottom-0 flex position right-48">
      <button pill bg-gradient-red @click="clearStorage">Delete Storage</button>
    </div>
  </div>
</template>
