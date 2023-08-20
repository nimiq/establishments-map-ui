<script setup lang="ts">
import type { PropType } from 'vue'
import type { Location } from '@/types'

defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <template v-if="location.isShop">
    <div
      class="absolute rounded-t-lg right-4 bottom-4 bg-[radial-gradient(100%_75.78%_at_100%_0%,_#ffffff_0%,_rgba(255,_255,_255,_0)_100%)] opacity-20 pointer-events-none"
    />
    <div
      class="grid place-content-center absolute z-20 -right-0.5 -bottom-1.5  pointer-events-none bg-[url(@/assets/provider-rings-bg.svg)] bg-[59px_59px] bg-no-repeat h-[186px] w-[186px]"
    >
      <div
        class="absolute grid p-2 bg-white rounded-full w-9 h-9 right-4 bottom-4 place-content-center"
        style="box-shadow: 0px 12.8571px 27.1429px rgba(31, 35, 72, 0.07), 0px 5px 6.07143px rgba(31, 35, 72, 0.04), 0px 1.42857px 1.78571px rgba(31, 35, 72, 0.02)"
      >
        <component :is="location.providerIcon" v-if="progress === 1" class="w-6 h-6 zoom-in " />
      </div>
    </div>
  </template>

  <template v-if="location.isAtm">
    <div class="absolute bottom-0 right-0 z-20 grid pointer-events-none place-content-center">
      <div
        class="absolute -bottom-2.5 -right-2.5 bg-[url(@/assets/atm-provider-rings-bg.svg)] bg-no-repeat h-[118px] w-[118px]"
        data-rings
      />
      <component :is="location.providerIcon" class="w-9 h-9 absolute right-[30px] bottom-[30px]" />
    </div>
  </template>
</template>
