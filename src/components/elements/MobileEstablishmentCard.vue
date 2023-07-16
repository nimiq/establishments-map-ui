<script setup lang="ts">
import BasicEstablishmentInfo from "@/components/elements/BasicEstablishmentInfo.vue";
import CryptoList from "@/components/elements/CryptoList.vue";
import SheetModal from "@/components/elements/SheetModal.vue";
import { inject, ref, watch, type PropType } from 'vue';
import { MOBILE_LIST_PROVIDER_KEY, type MobileListProvider } from "./MobileList.vue";
import type { NewEstablishment } from "@/database";

defineProps({
  e: {
    type: Object as PropType<NewEstablishment>,
    required: true,
  }
})

const sheetModal = ref<typeof SheetModal>()

const INITIAL_GAP_TO_SCREEN = 20/*px*/ // The gap to the screen
const INITIAL_BORDER_RADIUS = 8/*px*/

const INITIAL_HEIGHT = 162
const MAX_INITIAL_HEIGHT = 371

const dif = MAX_INITIAL_HEIGHT - INITIAL_HEIGHT

const style = ref()
const { progress, updateProgress } = inject<MobileListProvider>(MOBILE_LIST_PROVIDER_KEY)!

function onDrag(progress: number) {
  const radius = (1 - progress) * INITIAL_BORDER_RADIUS

  style.value = {
    height: `${INITIAL_HEIGHT + dif * progress}px`,
    marginBottom: `${(1 - progress) * INITIAL_GAP_TO_SCREEN}px`,
    borderBottomRightRadius: `${radius}px`,
    borderBottomLeftRadius: `${radius}px`,
    width: `${window.innerWidth - (1 - progress) * 40}px`,
  }
}

watch(progress, onDrag, { immediate: true })
</script>

<template>
  <SheetModal ref="sheetModal" :initial-height="INITIAL_HEIGHT" :max-height="MAX_INITIAL_HEIGHT" :style="style"
    class="relative w-full px-6 pb-5 bg-white rounded-t-lg sheet-transition" :progress="progress"
    @update:progress="updateProgress">
    <BasicEstablishmentInfo :name="e.name" :address="e.address" :gmaps-type="e.gmapsType" :rating="e.rating"
      :url="e.url" />
    <CryptoList :cryptos="e.buy" theme="dark" layout="pill" class="mt-5" />
  </SheetModal>
</template>

<style>
.sheet-transition {
  transition: margin-bottom var(--duration), margin-left var(--duration), width var(--duration), border-bottom-right-radius var(--duration), border-bottom-left-radius var(--duration), height var(--duration);
}
</style>

