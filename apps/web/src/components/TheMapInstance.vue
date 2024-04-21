<script setup lang="ts">
import { GoogleMap } from 'vue3-google-map'

const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAP_KEY

const { params: initialParams } = useRoute()
const { mapLoaded, showSplashScreen } = storeToRefs(useApp())
const { query } = useRoute()
const setInitialMapPosition = () => useInitialMapPosition(initialParams, query)

const mapStore = useMap()
const { mapInstance } = storeToRefs(mapStore)

const isDark = useDark()
const googleMapStyles = ref<(typeof GoogleMap.map.MapTypeStyle)[]>()
onMounted(async () => {
  const module = isDark.value ? await import('@/assets/map-styles/dark.ts') : await import('@/assets/map-styles/light.ts')
  googleMapStyles.value = module.default as (typeof GoogleMap.map.MapTypeStyle)[]
})

const restriction = {
  latLngBounds: { north: 80, south: -80, west: Number.NEGATIVE_INFINITY, east: Number.POSITIVE_INFINITY },
  strictBounds: true,
}

const validGestureBehaviours = ['cooperative', 'greedy', 'none', 'auto'] as const
type GestureBehaviour = typeof validGestureBehaviours[number]

const gestureBehaviourParam = useRoute().params.gestureBehaviour
const mapGestureBehaviour
  = typeof gestureBehaviourParam === 'string' && ['cooperative', 'greedy', 'none', 'auto'].includes(gestureBehaviourParam)
    ? gestureBehaviourParam as GestureBehaviour
    : 'greedy'
</script>

<template>
  <transition leave-active-class="duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div
      v-if="showSplashScreen"
      absolute inset-0 grid h-screen h-100dvh px-48 z-100 place-content-center bg-neutral-0
    >
      <div i-nimiq:logos-crypto-map-horizontal dark:i-nimiq:logos-crypto-map-white-horizontal aria-hidden class="!h64 !w-[min(510px,90vw)] animate-fade" />
      <i18n-t absolute inset-x-0 bottom-0 w-screen p-16 text="12 desktop:center neutral-800" tag="div" keypath="This site is protected by reCAPTCHA and the Google {privacyPolicy} and {termsOfService} apply.">
        <template #privacyPolicy>
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" class="underline text-space/80 dark:text-white/60">{{ $t('Privacy Policy') }}</a>
        </template>
        <template #termsOfService>
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener" class="underline text-space/80 dark:text-white/60">{{ $t('Terms of Service') }}</a>
        </template>
      </i18n-t>
    </div>
  </transition>

  <GoogleMap
    ref="mapInstance" v-bind="$attrs" :api-key="GOOGLE_MAP_KEY" :language="i18n.locale" disable-default-ui :gesture-handling="mapGestureBehaviour"
    :keyboard-shortcuts="false" :styles="googleMapStyles" :max-zoom="21" :min-zoom="3" :restriction="restriction" :clickable-icons="false" :libraries="['places', 'maps'] as unknown as ['places']"
    @idle.once="() => { mapLoaded = true; setInitialMapPosition() }"
  >
    <MapMarkers />
  </GoogleMap>
</template>
