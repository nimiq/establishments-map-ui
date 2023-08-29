<script setup lang="ts">
import {
  DropdownMenuItem,
} from 'radix-vue'
import {} from '@nimiq/vue3-components'
import IconShare from '@/components/icons/icon-share.vue'
import IconFlag from '@/components/icons/icon-flag.vue'
import DotsMenu from '@/components/atoms/DotsMenu.vue'

function handleClick() {
  alert('Hello there')
}
</script>

<template>
  <DotsMenu v-bind="$attrs">
    <DropdownMenuItem
      class="flex px-4 py-2 text-white transition-colors outline-none cursor-pointer select-none hover:text-white/80"
      @click="handleClick"
    >
      <IconShare class="w-4 h-4 mr-3" />
      <span class="text-base font-semibold leading-4">Share</span>
    </DropdownMenuItem>
    <DropdownMenuItem
      class="flex px-4 py-2 transition-colors outline-none cursor-pointer select-none text-salmon hover:text-salmon/80"
      @click="handleClick"
    >
      <IconFlag class="w-4 h-4 mr-3" />
      <span class="text-base font-semibold leading-4">Report</span>
    </DropdownMenuItem>
  </DotsMenu>
</template>
