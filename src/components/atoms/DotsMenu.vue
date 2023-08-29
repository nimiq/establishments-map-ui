<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue'
import { MenuDotsIcon } from '@nimiq/vue3-components'

const toggleState = ref(false)
</script>

<!-- Example about how to use this in ShareAndReportMenu.vue -->

<template>
  <DropdownMenuRoot v-model:open="toggleState">
    <DropdownMenuTrigger v-bind="$attrs">
      <MenuDotsIcon class="w-5 h-5 text-space/30" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="outline-none bg-gradient-space rounded-sm p-1 will-change-[opacity] shadow"
        :side-offset="10"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
