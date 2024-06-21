<script setup lang="ts">
const props = defineProps<{ options: string[] }>()
const selected = defineModel<string>('selected')
const options = computed(() => props.options.filter(option => option !== selected.value).concat(selected.value!))
</script>

<template>
  <SelectRoot v-model="selected">
    <SelectTrigger select rounded-4 px-12 py-6 outline-none hover:bg-neutral-200 focus-visible:outline-blue>
      <SelectValue flex="~ items-center gap-8" label text="14 neutral-900" as="div" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        side="bottom"
        position="item-aligned" select relative bottom-0 z-200 animate-fade-in animate-duration-100 rounded-6 py-6 text-neutral-0 shadow drop-shadow bg-gradient-neutral
      >
        <SelectViewport>
          <SelectItem
            v-for="option in options" :key="option" :value="option" group cursor-pointer px-12 py-4
            outline="none hocus:none"
          >
            <SelectItemText
              text="14 neutral-600/80 group-hocus:neutral-0" transition-colors label
              flex="~ items-center justify-between gap-8"
            >
              {{ option }}
              <div
                aria-hidden i-nimiq:triangle-left
                text="7 r-select-closed:neutral-600 transparent group-hover:neutral-700"
                rotate="-90 r-select-hocus:0 r-select-open:0" duration-1000 group-hocus:scale-115
              />
            </SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style>
[i-nimiq\:triangle-left] {
  transition: 100ms opacity var(--nq-ease), 400ms transform var(--nq-ease);
}
</style>
