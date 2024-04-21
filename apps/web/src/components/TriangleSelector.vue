<script setup lang="ts">
const props = defineProps<{ options: string[] }>()
const selected = defineModel<string>('selected')
const options = computed(() => props.options.filter(option => option !== selected.value).concat(selected.value!))
</script>

<template>
  <SelectRoot v-model="selected">
    <SelectTrigger px-12 py-6 group select outline-none focus-visible:outline-blue rounded-4 hover:bg-neutral-200>
      <SelectValue flex="~ items-center gap-8" label text="14 neutral-900" as="div" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent bg-gradient-neutral text-neutral-0 shadow rounded-6 bottom-0 drop-shadow relative side="bottom" position="item-aligned" py-6 animate-fade-in animate-duration-100 z-100 select>
        <SelectViewport>
          <SelectItem v-for="option in options" :key="option" :value="option" px-12 py-4 cursor-pointer group outline="none hocus:none">
            <SelectItemText label text="14 neutral-600/80 group-hocus:neutral-0" transition-colors flex="~ items-center justify-between gap-8">
              {{ option }}
              <div aria-hidden i-nimiq:triangle-left text="7 select-closed:neutral-600 transparent group-hover:neutral-700" rotate="-90 group-hover:0 select-open:0" duration-1000 group-hocus:scale-115 />
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
