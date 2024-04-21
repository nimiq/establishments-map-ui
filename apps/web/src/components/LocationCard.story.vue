<script setup lang="ts">
import { computed, ref } from 'vue'
import LocationCard from './LocationCard.vue'
import { locations } from '@/assets-dev/stories/locations'

const progressState = ref<'expanded' | 'not-expanded' | 'loop' | 'custom'>('expanded')
const customProgress = ref(0)

const intervalValue = ref(0)
setInterval(() => {
  if (progressState.value !== 'loop')
    return
  intervalValue.value = (intervalValue.value + 0.01) % 1.2
}, 1)

const progress = computed(() => {
  if (progressState.value === 'expanded')
    return 1
  if (progressState.value === 'not-expanded')
    return 0
  return intervalValue.value % 1
})
</script>

<template>
  <Story title="Card" :layout="{ type: 'grid', width: '360px' }">
    <template #controls>
      <div flex="~ flex-col gap-x-8" p-16>
        <label for="expanded" class="select-none">Progress State</label>
        <select v-model="progressState" class="text-black bg-transparent bg-snow">
          <option name="expanded" value="expanded" class="text-black">
            Expanded
          </option>
          <option name="not-expanded" value="not-expanded" class="text-black">
            Not expanded
          </option>
          <option name="loop" value="loop" class="text-black">
            Loop
          </option>
          <option name="custom" value="custom" class="text-black">
            Custom
          </option>
        </select>
      </div>

      <div v-if="progressState === 'custom'" class="flex flex-col px4 py4 gap-x-2">
        <label for="expanded">Custom Progress</label>
        <input id="customProgress" v-model="customProgress" name="customProgress" class="text-black" type="number">
      </div>
    </template>

    <Variant v-for="(l, i) in locations" :key="i" :title="l.provider" class="flex items-end h-full">
      <LocationCard
        :location="l" :progress="progressState === 'custom' ? customProgress : progress"
        class="relative"
      />
    </Variant>
  </Story>
</template>
