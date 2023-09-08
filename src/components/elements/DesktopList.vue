<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Cluster, Location } from 'types'
import { type PropType, ref, watch } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import BasicInfo from '@/components/elements/BasicInfo.vue'
import CardBg from '@/components/elements/CardBg.vue'
import IconCactusDesert from '@/components/icons/icon-cactus-desert.vue'
import { useLocations } from '@/stores/locations'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const props = defineProps({
  singles: {
    type: Array as PropType<Location[]>,
    required: true,
  },
  clusters: {
    type: Array as PropType<Cluster[]>,
    required: true,
  },
  listIsShown: {
    type: Boolean,
    default: true,
  },
})

let uuidClickedInList: string | undefined

function onLocationClicked({ uuid }: Location) {
  uuidClickedInList = uuid
  ;(document.querySelector(`[data-trigger-uuid="${uuid}"]`) as HTMLElement)?.click()
}

const scroller = ref<DynamicScroller>()

const { selectedUuid } = storeToRefs(useLocations())

watch(selectedUuid, (uuid) => {
  if (!uuid || !scroller.value)
    return

  // Prevent scrolling when clicking a location in the list
  if (uuidClickedInList === uuid)
    return
  uuidClickedInList = undefined

  const index = props.singles.findIndex(location => location.uuid === uuid)
  scroller.value.scrollToItem(index - 2) // -2 to scroll the location to 2 entries from the top of the list
})
</script>

<template>
  <DynamicScroller
    v-if="singles.length || clusters.length"
    ref="scroller"
    key-field="uuid"
    :items="singles"
    :min-item-size="99"
    list-tag="ul"
    item-tag="li"
    class="overflow-auto scroll-space transition-[height] will-change-[height]"
    :class="listIsShown ? 'h-[calc(100vh-10.5rem)]' : 'h-0'"
    item-class="relative overflow-hidden border-space/10 border-t-xs group/card [&_[data-rings]]:-rotate-90"
  >
    <template #default="{ item: location, active }">
      <DynamicScrollerItem
        :key="location.uuid"
        :item="location"
        :active="active"
      >
        <button
          class="w-full px-6 py-5 text-left bg-[--bg-1] hocus:bg-[--bg-2] transition-colors"
          :style="{
            '--bg-1': location.isAtm && location.isDark ? location.bg[0] : 'white',
            '--bg-2': location.isAtm && location.isDark && location.bg[1] ? location.bg[1] : '#f4f4f6',
          }"
          @click="onLocationClicked(location)"
        >
          <CardBg v-if="location.isAtm" :location="location" :with-gradient="false" class="translate-y-1" />
          <BasicInfo :location="location" />
        </button>
      </DynamicScrollerItem>
    </template>

    <template v-if="clusters.length" #after>
      <div class="px-6 py-5 text-sm font-semibold border-space/10 border-t-xs text-space/50">
        {{ $tc('+ {count} grouped', clusters.reduce((sum, cluster) => sum + cluster.count, 0)) }}
      </div>
    </template>
  </DynamicScroller>
  <div
    v-else
    class="flex flex-col items-center justify-center gap-6 px-4 transition-height will-change-height"
    :class="listIsShown ? 'h-[calc(100vh-10.5rem)]' : 'h-0'"
  >
    <IconCactusDesert />
    <span class="text-base text-center text-space font-regular" :class="!listIsShown && 'h-0'">
      {{ $t('Oops, no businesses around here') }}
    </span>
  </div>
</template>
