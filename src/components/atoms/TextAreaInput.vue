<script setup lang="ts">
import { ref, watch } from 'vue'
import { i18n } from '@/i18n/i18n-setup'

const props = defineProps({
  modelValue: {
    type: String,
  },
  label: {
    type: String,
    default: () => i18n.t('Describe here'),
  },
  placeholder: {
    type: String,
    default: () => i18n.t('Describe here'),
  },
})

const emit = defineEmits(['update:modelValue'])

const value = ref<string>(props.modelValue || '')
watch(value, value => emit('update:modelValue', value))

const randomId = Math.random().toString(36).substring(7)
</script>

<template>
  <div>
    <label :for="randomId" class="text-space/40">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <textarea
      :id="randomId" v-model="value" width="100%"
      :placeholder="placeholder"
      class="w-full min-h-[224px] ring-[1.5px] ring-space/[0.15] rounded-sm max-h-[50vh] pt-[8.5px] pb-[4.5px] px-4"
    />
  </div>
</template>
