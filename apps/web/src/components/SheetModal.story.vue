<script setup lang="ts">
import { ref } from 'vue'
import SheetModal from './SheetModal.vue'

const progress = ref(0)
</script>

<template>
  <Story title="Modal Sheet">
    <div class="relative h-screen bg-space/20">
      <SheetModal
        class="inset-x-0 bottom-0 mx-auto text-center text-white rounded-lg shadow bg-space"
        :progress="progress" :initial-height="171" :max-height="371" :initial-border-radius="8"
        :initial-gap-to-screen="20" @update:progress="progress = $event"
      >
        <template #dragger>
          <div class="pt-2 pb-5 cursor-grab">
            <hr class="w-32 h-1 mx-auto border-0 rounded-full bg-white/20">
          </div>
        </template>

        Progress: {{ progress.toFixed(3) }}
      </SheetModal>
    </div>
  </Story>
</template>
