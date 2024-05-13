<script setup lang="ts">
import MobileList from './MobileList.vue'
import { locations } from '@/assets-dev/stories/locations'
</script>

<template>
  <Story title="Mobile List">
    <Variant title="Default">
      <div class="relative h-screen">
        <img src="@/assets-dev/stories/map-new-york-square.png" alt="" class="h-full object-cover">
        <div class="absolute bottom-0 w-full">
          <MobileList :locations="Object.values(locations)" class="relative" />
        </div>
      </div>
    </Variant>
  </Story>
</template>
