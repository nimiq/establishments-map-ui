<script setup lang="ts">
import type { CryptocityData } from 'types'
import type { PropType } from 'vue'
import CryptocityIcon from '@/components/icons/icon-cryptocity.vue'
import Button from '@/components/atoms/Button.vue'

defineProps({
  cryptocity: {
    type: Object as PropType<CryptocityData>,
    required: true,
  },
  showDescription: {
    default: false,
    type: Boolean,
  },
})

defineEmits({
  iconClick: (e: MouseEvent) => true,
})

// const { smaller } = useBreakpoints(screens)
// const DESKTOP_LAYOUT = 'md' // FIXME This is suppose to be the same value as in the tailwind config
// const isMobile = smaller(DESKTOP_LAYOUT)
</script>

<template>
  <div
    class="transition-all duration-300 bg-white shadow cursor-default ring-white/20 ring-1 ring-offset-1 ring-offset-white/10 desktop:max-w-xs" :class="{
      'rounded-md p-6': showDescription,
      'rounded-[50px] px-3 py-1.5': !showDescription,
    }"
    @pointerdown.capture.stop.prevent
    @dblclick.capture.stop.prevent
  >
    <div class="flex items-center gap-x-2">
      <CryptocityIcon class="w-[31px] h-[27px]" />
      <div>
        <h3 class="text-base text-space">{{ cryptocity.name }}</h3>
        <span class="block w-24 h-3 text-sm leading-[1] rounded-sm text-space/60 bg-space/[0.15]" :class="cryptocity.count === -1 && 'animate-pulse'">
          <template v-if="cryptocity.count > 0 ">{{ $tc('{count} locations', cryptocity.count) }}</template>
        </span>
      </div>

      <slot class="ml-auto" name="close" />
    </div>
    <div
      class="grid transition-[grid-template-rows] grid-cols-[mEin(290px,calc(100vh-48px))] duration-300" :class="{
        'grid-rows-[0fr]': !showDescription,
        'grid-rows-[1fr] mt-3': showDescription,
      }"
    >
      <div class="overflow-hidden delay-[2s]" :class="{ '[&>*]:opacity-0': !showDescription, '[&>*]:opacity-100': showDescription }">
        <p v-for="(p, i) in cryptocity.description" :key="i" class="pt-2 text-xs text-space/70">{{ p }}</p>
        <Button :href="cryptocity.url" class="mt-2 !p-0 !h-auto" bg-color="transparent" size="sm" text-color="sky">
          <template #label>
            {{ cryptocity.url }}
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>
