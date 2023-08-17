<script setup lang="ts">
import Button from '@/components/atoms/Button.vue'
import GeolocationIcon from '@/components/icons/icon-geolocation.vue'
import MinusIcon from '@/components/icons/icon-minus.vue'
import PlusIcon from '@/components/icons/icon-plus.vue'
import { useMap } from '@/stores/map'

const { userLocationIsSupported, geolocateUser, increaseZoom, decreaseZoom } = useMap()
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <Button
      v-if="userLocationIsSupported" style="width: 34px; height: 34px" bg-color="white" size="sm" :aria-label="$t('Show your location')"
      :title="$t('Show your location')" @click="geolocateUser()"
    >
      <template #icon>
        <GeolocationIcon />
      </template>
    </Button>

    <div class="flex flex-col bg-white rounded-full shadow max-desktop:hidden">
      <Button style="width: 34px; height: 34px" bg-color="white" size="sm" class="rounded-b-0" @click="increaseZoom()">
        <template #icon>
          <PlusIcon />
        </template>
      </Button>

      <hr class="self-stretch h-px bg-space/10">

      <Button style="width: 34px; height: 34px" bg-color="white" size="sm" class="rounded-t-0" @click="decreaseZoom()">
        <template #icon>
          <MinusIcon />
        </template>
      </Button>
    </div>
  </div>
</template>
