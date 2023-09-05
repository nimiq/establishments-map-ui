<script setup lang="ts">
import Button from '@/components/atoms/Button.vue'
import IconChevronDown from '@/components/icons/icon-chevron-down.vue'

defineProps({
  firstLocationsLoaded: {
    type: Boolean,
    required: true,
  },
  listIsShown: {
    type: Boolean,
    required: true,
  },
  chevronDirection: {
    type: String,
    default: 'down',
  },
})

const emit = defineEmits({
  click: () => true,
})

function handleClick() {
  emit('click')
}
</script>

<template>
  <Button bg-color="white" :loading="!firstLocationsLoaded" @click="handleClick">
    <template v-if="firstLocationsLoaded" #icon>
      <IconChevronDown :class="{ 'rotate-180': chevronDirection === 'down' ? listIsShown : !listIsShown }" class="transition-transform delay-500" />
    </template>
    <template #label>
      <template v-if="!firstLocationsLoaded">
        {{ $t('Loading') }}
      </template>
      <template v-else-if="listIsShown">
        {{ $t('Hide list') }}
      </template>
      <template v-else>
        {{ $t('Show list') }}
      </template>
    </template>
  </Button>
</template>
