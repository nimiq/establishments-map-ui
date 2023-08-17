<script setup lang="ts">
import Button from './Button.vue'
</script>

<template>
  <Story title="Button" :layout="{ type: 'grid', width: '400px' }">
    <Variant title="default">
      <Button bg-color="space" size="md">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-3 h-3 text-white">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M1 8h14M8 1v14" />
          </svg>
        </template>

        <template #label>
          {{ $t('Show more Locations') }}
        </template>
      </Button>
    </Variant>
    <Variant title="Icon">
      <Button bg-color="white" size="lg">
        <template #icon>
          <svg viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-3 text-space">
            <path
              d="M10.5 1 6 5 1.5 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </template>
      </Button>
    </Variant>
  </Story>
</template>
