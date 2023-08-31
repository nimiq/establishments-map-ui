<script setup lang="ts">
import { ref } from 'vue'
import IconCircleSpinner from '../icons/icon-circle-spinner.vue'
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
      :disabled="geolocatingUserBrowser" style="width: 34px; height: 34px" bg-color="white" size="sm" :aria-label="$t('Show your location')"
      :title="$t('Show your location')"
      @click="setBrowserPosition"
    >
      <template #icon>
        <GeolocationIcon v-if="!isGeolocationLoading" />
        <IconCircleSpinner v-else class="w-4 h-4 text-space" />
      </template>
    </Button>

    <div class="flex flex-col bg-white rounded-full shadow max-desktop:hidden">
      <Button style="width: 34px; height: 34px" bg-color="white" size="sm" class="rounded-b-0" @click="useMap().increaseZoom">
        <template #icon>
          <PlusIcon />
        </template>
      </Button>

      <hr class="self-stretch h-px bg-space/10">

      <Button style="width: 34px; height: 34px" bg-color="white" size="sm" class="rounded-t-0" @click="useMap().decreaseZoom">
        <template #icon>
          <MinusIcon />
        </template>
      </Button>
    </div>
  </div>
</template>
