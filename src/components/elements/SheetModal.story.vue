<script setup lang="ts">
import SheetModal from "./SheetModal.vue";
</script>

<template>
  <Story title="Modal Sheet">
    <div class="relative w-screen h-[100dvh] bg-space/20">
      <SheetModal class="text-center bg-white rounded-lg shadow" :initial-height="171" :max-height="371">
      </SheetModal>
    </div>
  </Story>
</template>

