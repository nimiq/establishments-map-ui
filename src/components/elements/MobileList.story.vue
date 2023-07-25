<script setup lang="ts">
import { locations } from "@/assets-dev/stories/locations";
import MobileList from "./MobileList.vue";
</script>

<template>
  <Story title="Mobile List">
    <Variant title="Default">
      <div class="relative h-screen">
        <img src="@/assets-dev/stories/map-new-york-square.png" alt="" class="object-cover h-full">
        <div class="absolute bottom-0 w-full">
          <MobileList :locations="Object.values(locations)" class="relative" />
        </div>
      </div>
    </Variant>
  </Story>
</template>
