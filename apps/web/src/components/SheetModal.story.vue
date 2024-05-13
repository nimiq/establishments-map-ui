<script setup lang="ts">
import { ref } from 'vue'
import SheetModal from './SheetModal.vue'

const progress = ref(0)
</script>

<template>
  <Story title="Modal Sheet">
    <div class="bg-space/20 relative h-screen">
      <SheetModal
        class="bg-space inset-x-0 bottom-0 mx-auto rounded-lg text-center text-white shadow"
        :progress="progress" :initial-height="171" :max-height="371" :initial-border-radius="8"
        :initial-gap-to-screen="20" @update:progress="progress = $event"
      >
        <template #dragger>
          <div class="cursor-grab pb-5 pt-2">
            <hr class="mx-auto h-1 w-32 border-0 rounded-full bg-white/20">
          </div>
        </template>

        Progress: {{ progress.toFixed(3) }}
      </SheetModal>
    </div>
  </Story>
</template>
