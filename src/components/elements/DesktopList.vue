<script setup lang="ts">
import { type PropType, ref, watch } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { storeToRefs } from 'pinia'
import type { Cluster, Location } from 'types'
import BasicInfo from '@/components/elements/BasicInfo.vue'
import CardBg from '@/components/elements/CardBg.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useLocations } from '@/stores/locations'

const props = defineProps({
  locations: {
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

  const index = props.locations.findIndex(location => location.uuid === uuid)
  scroller.value.scrollToItem(index - 2) // -2 to scroll the location to 2 entries from the top of the list
})
</script>

<template>
  <DynamicScroller
    ref="scroller"
    key-field="uuid"
    :items="locations"
    :min-item-size="99"
    list-tag="ul"
    item-tag="li"
    :class="`overflow-auto scroll-space transition-[height] will-change-[height] ${listIsShown ? 'h-[calc(100vh-10.5rem)]' : 'h-0'}`"
    item-class="relative overflow-hidden border-space/10 border-t-xs group/card [&_[data-rings]]:-rotate-90"
  >
    <template #default="{ item: location, active }">
      <DynamicScrollerItem
        :key="location.uuid"
        :item="location"
        :active="active"
      >
        <button
          class="w-full px-6 py-5 text-left"
          :style="`background: ${location.isAtm && location.isDark ? location.bg : 'white'}`"
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
</template>
