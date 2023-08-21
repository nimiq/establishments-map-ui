<script setup lang="ts">
import Button from '@/components/atoms/Button.vue'
import GeolocationIcon from '@/components/icons/icon-geolocation.vue'
import MinusIcon from '@/components/icons/icon-minus.vue'
import PlusIcon from '@/components/icons/icon-plus.vue'
import { useGeoIp } from '@/composables/useGeoLocation'
import { useMap } from '@/stores/map'

const { browserLocationIsSupported, geolocateUser, browserPosition, errorBrowser } = useGeoIp()

function setBrowserPosition() {
  geolocateUser()

  if (!browserPosition.value)
    console.error(errorBrowser.value) // TODO show error to user

  useMap().setPosition(browserPosition.value)
}
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <Button
      v-if="browserLocationIsSupported" style="width: 34px; height: 34px" bg-color="white" size="sm" :aria-label="$t('Show your location')"
      :title="$t('Show your location')" @click="setBrowserPosition"
    >
      <template #icon>
        <GeolocationIcon />
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
