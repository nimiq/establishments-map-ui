<script lang="ts" setup>
const props = defineProps<{ accuracy: number, zoom: number }>()

const styleObject = reactive({ '--radius': '64px' })

watch(() => props.accuracy, () => styleObject['--radius'] = `${Math.min(64, Math.max(24, props.accuracy))}px`, { immediate: true })
</script>

<template>
  <div rounded-full bg-blue-300 op-60 size="$radius" :style="styleObject" />
  <div absolute size-10 rounded-full bg-blue ring="2 white" top="50%" left="50%" transform="translate--50%" />
</template>
