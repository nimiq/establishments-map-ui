<script setup lang="ts">
const isDev = import.meta.env.DEV

const { setBrowserPosition } = useGeoIp()
const { browserPositionIsSupported, geolocatingUserBrowser } = storeToRefs(useGeoIp())

function clearStorage() {
  if (!import.meta.env.DEV)
    return
  localStorage.clear()
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
  })
}
</script>

<template>
  <div flex="~ col items-end gap-y-16">
    <button
      v-if="browserPositionIsSupported" ring="1.5 neutral/3" bg="neutral-0 hover:neutral-100" size-32 rounded-full
      text-14 shadow flex="~ items-center justify-center" :disabled="geolocatingUserBrowser"
      :aria-label="$t('Show your location')" :title="$t('Show your location')" @click="setBrowserPosition"
    >
      <div i-nimiq:gps />
    </button>

    <div flex="~ col" ring="1.5 neutral/3" w-32 rounded-full text-12 shadow max-desktop:hidden>
      <button
        size-32 rounded-t-full bg="neutral-0 hover:neutral-100" transition-colors
        flex="~ justify-center items-center" :aria-label="$t('Increase zoom')" :title="$t('Increase zoom')"
        @click="useMap().increaseZoom"
      >
        <div i-nimiq:plus />
      </button>
      <hr h-1 self-stretch bg-neutral-100>
      <button
        size-32 rounded-b-full bg="neutral-0 hover:neutral-100" transition-colors
        flex="~ justify-center items-center" :aria-label="$t('Decrease zoom')" :title="$t('Decrease zoom')"
        @click="useMap().decreaseZoom"
      >
        <div i-nimiq:minus />
      </button>
    </div>

    <div v-if="isDev" class="position absolute bottom-0 right-48 flex">
      <button bg-gradient-red pill @click="clearStorage">
        Delete Storage
      </button>
    </div>
  </div>
</template>
