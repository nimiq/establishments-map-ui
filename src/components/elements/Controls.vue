<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/atoms/Button.vue'
import GeolocationIcon from '@/components/icons/icon-geolocation.vue'
import MinusIcon from '@/components/icons/icon-minus.vue'
import PlusIcon from '@/components/icons/icon-plus.vue'
import { useGeoIp } from '@/composables/useGeoLocation'
import { useMap } from '@/stores/map'

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
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <Button
      v-if="browserPositionIsSupported"
      class="!w-10 !h-10 shadow"
      :disabled="geolocatingUserBrowser" bg-color="white" :aria-label="$t('Show your location')"
      :title="$t('Show your location')"
      @click="setBrowserPosition"
    >
      <template #icon>
        <GeolocationIcon />
      </template>
    </Button>

    <div class="flex flex-col bg-white rounded-full shadow max-desktop:hidden">
      <Button bg-color="white" class="!w-10 !h-10 rounded-b-0" @click="useMap().increaseZoom">
        <template #icon>
          <PlusIcon />
        </template>
      </Button>

      <hr class="self-stretch h-[2px] -my-px bg-space/10">

      <Button bg-color="white" class="!w-10 !h-10 rounded-t-0" @click="useMap().decreaseZoom">
        <template #icon>
          <MinusIcon />
        </template>
      </Button>
    </div>
  </div>
</template>
