<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const props = defineProps<{ singles: MapLocation[], clusters: Cluster[], listIsShown: boolean }>()

let uuidClickedInList: string | undefined

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
    v-if="singles.length || clusters.length" ref="scroller" key-field="uuid" :items="singles"
    :min-item-size="99" list-tag="ul" item-tag="li" max-w-320 of-auto transition-height duration-300 will-change-height
    :style="{ height: listIsShown ? 'calc(100vh - 10.5rem - var(--dynamic-block, 0) * 88px)' : '0' }"
    item-class="relative of-hidden ring-neutral-100 border-t-1 group/card [&_[data-rings]]:-rotate-90"
    :data-state="listIsShown ? 'open' : 'closed'"
  >
    <template #default="{ item: location, active }">
      <DynamicScrollerItem :key="location.uuid" :item="location" :active="active">
        <button
          w-full px-24 py-20 text-left bg="$bg-1 image-$bg-1 hocus:$bg-2 hocus:image-$bg-2" transition-colors
          :data-inverted="location.isAtm && location.isDark ? 'true' : undefined" :style="{
            '--bg-1': location.isAtm && location.isDark ? location.bg[0] : 'rgb(var(--nq-neutral-0))',
            '--bg-2': location.isAtm && location.isDark && location.bg[1] ? location.bg[1] : 'rgb(var(--nq-neutral-100))',
          }" @click="useLocations().goToLocation(location.uuid, { open: true })"
        >
          <LocationCardBg v-if="location.isAtm" :location="location" :with-gradient="false" translate-y-1 />
          <BasicInfoLocation :location="location" />
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
    v-else flex="~ col items-center justify-center gap-24"
    max-w-320 of-hidden px-20 transition-height duration-300 will-change-height
    :style="{ height: listIsShown ? 'calc(100vh - 10.5rem - var(--dynamic-block, 0) * 88px)' : '0' }"
  >
    <div i-nimiq:icons-lg-cactus text-80 op-80 />
    <span text="16 center">
      {{ $t('Oops, no businesses around here') }}
    </span>
  </div>
</template>
