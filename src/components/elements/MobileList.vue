<script lang="ts">
export const MOBILE_LIST_PROVIDER_KEY = Symbol();

export type MobileListProvider = {
  progress: Ref<number>,
  updateProgress: (progress: number) => void
}
</script>

<script setup lang="ts">
import MobileEstablishmentCard from "@/components/elements/MobileEstablishmentCard.vue";
import type { NewEstablishment } from '@/database';
import { provide, readonly, ref, type PropType, type Ref } from "vue";

defineProps({
  establishments: {
    type: Array as PropType<NewEstablishment[]>,
    default: () => [],
  },
})

const progress = ref(0) // 0 to 1
const updateProgress = (newProgress: number) => progress.value = newProgress;
updateProgress(0)
provide<MobileListProvider>(MOBILE_LIST_PROVIDER_KEY, { progress: readonly(progress), updateProgress })
</script>

<template>
  <ul
    class="flex items-end w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-x-3 scroll-mx-[var(--spacing)]"
    :style="`--spacing: ${(1 - progress) * 20}px`">
    <li v-for="(establishment, i) in establishments" :key="i"
      class="relative shrink-0 snap-center first:pl-[var(--spacing)] last:pr-[var(--spacing)]">
      <MobileEstablishmentCard :e="establishment" />
    </li>
  </ul>
</template>
