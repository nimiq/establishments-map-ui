<script setup lang="ts">
const { setBrowserPosition } = useGeoIp()
const { browserPositionIsSupported, geolocatingUserBrowser } = storeToRefs(useGeoIp())

const isDev = import.meta.dev

function clearStorage() {
  if (!isDev || !import.meta.client)
    return
  localStorage.clear()
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
  })
}
</script>

<template>
  <div flex="~ col items-end gap-y-16">
    <!-- :title="$t('Show your location')" -->
    <button
      v-if="browserPositionIsSupported" ring="1.5 neutral/3" bg="neutral-0 hover:neutral-100" size-32 rounded-full
      text-14 shadow flex="~ items-center justify-center" :disabled="geolocatingUserBrowser"
      title="Show your location" @click="setBrowserPosition"
    >
      <div i-nimiq:gps />
    </button>

    <div flex="~ col" ring="1.5 neutral/3" w-32 rounded-full text-12 shadow max-desktop:hidden>
      <!-- :title="$t('Increase zoom')" -->
      <button
        size-32 rounded-t-full bg="neutral-0 hover:neutral-100" transition-colors
        flex="~ justify-center items-center" title="Increase zoom"
        @click="useMap().increaseZoom"
      >
        <div i-nimiq:plus />
      </button>
      <hr h-1 self-stretch bg-neutral-100>
      <!-- :title="$t('Decrease zoom')" -->
      <button
        size-32 rounded-b-full bg="neutral-0 hover:neutral-100" transition-colors
        flex="~ justify-center items-center" title="Decrease zoom"
        @click="useMap().decreaseZoom"
      >
        <div i-nimiq:minus />
      </button>
    </div>

    <div v-if="isDev" class="position absolute bottom-0 right-48 flex">
      <button bg-gradient-red nq-pill-lg @click="clearStorage">
        Delete Storage
      </button>
    </div>
  </div>
</template>
