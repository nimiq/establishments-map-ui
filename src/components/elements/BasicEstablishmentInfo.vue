<script setup lang="ts">
import Button from "@/components/elements/Button.vue";
import GmapsPin from "@/components/icons/icon-gmaps-pin.vue";
import StarFilledIcon from "@/components/icons/icon-star-filled.vue";
import StarIcon from "@/components/icons/icon-star.vue";

defineProps({
  name: {
    type: String,
    required: true,
  },
  gmapsType: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  url: {
    type: String,
  },
})
</script>

<template>
  <div class="grid grid-cols-[min-content_auto_max-content] gap-x-1.5 grid-rows-[repeat(3,auto)] items-center text-space">
    <h2 class="text-base font-bold leading-[1.3] col-span-2 pb-1">{{ name }}</h2>
    <Button bg-color="transparent" :href="url" border-color="grey"
      class="self-start row-span-3 lg:transition-opacity lsg:opacity-0 lg:group-hover/button:opacity-100" v-if="url"
      size="md">
      <template #icon>
        <GmapsPin />
      </template>
    </Button>
    <span class="text-xs font-semibold capitalize text-space/70">{{ gmapsType }}</span>
    <div class="flex gap-x-0.5" v-if="rating">
      <template v-for="i in 5" :key="i">
        <component class="w-3 h-3" :is="i <= rating ? StarFilledIcon : StarIcon" />
      </template>
    </div>
    <p class="text-xs leading-[1.5] text-space/70 grid-cols-1 col-span-3">
      {{ address }}
    </p>
  </div>
</template>
