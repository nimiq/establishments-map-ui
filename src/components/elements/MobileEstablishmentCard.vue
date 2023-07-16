<script setup lang="ts">
import BasicEstablishmentInfo from "@/components/elements/BasicEstablishmentInfo.vue";
import CryptoList from "@/components/elements/CryptoList.vue";
import SheetModal from "@/components/elements/SheetModal.vue";
import type { NewEstablishment } from "@/database";
import type { PropType } from 'vue';

defineProps({
  e: {
    type: Object as PropType<NewEstablishment>,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  },
  initialHeight: {
    type: Number,
    required: true,
  },
  maxHeight: {
    type: Number,
    required: true,
  },
  initialBorderRadius: {
    type: Number,
    default: 0,
  },
  initialGapToScreen: {
    type: Number,
    default: 20
  }
})

defineEmits({
  'update:progress': (_: number) => true,
})
</script>

<template>
  <SheetModal ref="sheetModal" :initial-height="initialHeight" :max-height="maxHeight"
    class="relative w-full px-6 pb-5 bg-white rounded-t-lg" :progress="progress"
    @update:progress="$emit('update:progress', $event)" :initial-border-radius="initialBorderRadius"
    :initial-gap-to-screen="initialGapToScreen">
    <BasicEstablishmentInfo :name="e.name" :address="e.address" :gmaps-type="e.gmapsType" :rating="e.rating"
      :url="e.url" />
    <CryptoList :cryptos="e.buy" theme="dark" layout="pill" class="mt-5" />
  </SheetModal>
</template>



