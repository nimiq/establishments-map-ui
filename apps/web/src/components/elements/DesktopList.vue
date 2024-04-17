<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Cluster, Location } from 'types'
import { ref, watch } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import BasicInfo from '@/components/cards/location/BasicInfoLocation.vue'
import CardBg from '@/components/cards/location/LocationCardBg.vue'
import IconCactusDesert from '@/components/icons/icon-cactus-desert.vue'
import { useLocations } from '@/stores/locations'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const props = defineProps<{singles: Location[], clusters: Cluster[], listIsShown: boolean}>()

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
    of-auto transition-height will-change-height
    :style="{ height: listIsShown ? 'calc(100vh - 10.5rem - var(--search-box-hint) * 90px)' : '0' }"
    item-class="relative of-hidden ring-neutral-100 border-t-1 group/card [&_[data-rings]]:-rotate-90"
  >
    <template #default="{ item: location, active }">
      <DynamicScrollerItem
        :key="location.uuid"
        :item="location"
        :active="active"
      >
        <button
          w-full px-24 py-20 text-left bg="$bg-1 hocus:$bg-2" transition-colors
          :style="{
            '--bg-1': location.isAtm && location.isDark ? location.bg[0] : 'white',
            '--bg-2': location.isAtm && location.isDark && location.bg[1] ? location.bg[1] : '#f4f4f6',
          }"
          @click="onLocationClicked(location)"
        >
          <CardBg v-if="location.isAtm" :location="location" :with-gradient="false" translate-y-1 />
          <BasicInfo :location="location" />
        </button>
      </DynamicScrollerItem>
    </template>

    <template v-if="clusters.length" #after>
      <div px-24 py-20 text-14 font-semibold ring-neutral-100>
        {{ $tc('+ {count} grouped', clusters.reduce((sum, cluster) => sum + cluster.count, 0)) }}
      </div>
    </template>
  </DynamicScroller>
  <div
    v-else
    class="flex flex-col items-center justify-center gap6 px4 transition-height will-change-height"
    :style="{ height: listIsShown ? 'calc(100vh - 10.5rem - var(--search-box-hint) * 90px)' : '0' }"
  >
    <IconCactusDesert />
    <span class="text-16 text-center text-space font-regular" :class="!listIsShown && 'h0'">
      {{ $t('Oops, no businesses around here') }}
    </span>
  </div>
</template>
