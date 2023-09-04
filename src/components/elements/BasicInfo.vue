<script setup lang="ts">
import { type PropType, computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { type Location, LocationLink } from 'types'
import Button from '@/components/atoms/Button.vue'
import StarFilledIcon from '@/components/icons/icon-star-filled.vue'
import StarIcon from '@/components/icons/icon-star.vue'
import { useLocations } from '@/stores/locations'

const props = defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
  nameAsLink: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
})

const showNameAsLink = computed(() => props.nameAsLink && props.location.url)

const { selectedUuid } = storeToRefs(useLocations())

const IconGmapsPin = defineAsyncComponent(() => import('@/components/icons/icon-gmaps-pin.vue'))
const InstagramLogo = defineAsyncComponent(() => import('@/components/icons/icon-instagram.vue'))
const FacebookLogo = defineAsyncComponent(() => import('@/components/icons/icon-facebook.vue'))
</script>

<template>
  <div
    class="relative grid grid-cols-[auto_1fr] grid-rows-[repeat(3,auto)] gap-x-1.5 items-center group/card" :class="{
      'text-white': location.isAtm && location.isDark,
      'text-space': !location.isAtm || location.isLight,
    }"
  >
    <component
      :is="showNameAsLink ? 'a' : 'h3'" :href="showNameAsLink ? location.url : undefined" :target="showNameAsLink ? '_blank' : undefined" class="text-base font-bold leading-[1.3] col-span-2 pb-1 text-balance max-w-[calc(100%-3rem)]"
      :class="{ 'text-sky': !location.isAtm && selectedUuid === location.uuid, 'cursor-pointer': location.url }"
    >
      <template v-if="location.isAtm">{{ $t('ATM') }} ({{ location.name }})</template>
      <template v-else>{{ location.name }}</template>
    </component>

    <div class="relative flex self-start row-span-2 ml-2">
      <Button
        v-if="location.url && progress < 0.5" bg-color="white" :href="location.url" border-color="grey"
        class="absolute z-100 top-0 transition-[top,right] !w-[52px] right-0 lg:opacity-0 lg:group-hover/card:opacity-100" size="sm"
      >
        <template #icon>
          <IconGmapsPin v-if="location.linkTo === LocationLink.GMaps" class="h-4" />
          <InstagramLogo v-else-if="location.linkTo === LocationLink.Instagram" class="h-4" />
          <FacebookLogo v-else-if="location.linkTo === LocationLink.Facebook" class="h-4" />
        </template>
      </Button>
    </div>

    <template v-if="!location.isAtm">
      <span class="row-start-2 text-xs font-semibold first-letter:capitalize text-space/60">
        {{ location.gmaps_types[0]?.replaceAll('_', ' ') || location.category_label }}
      </span>
      <div v-if="location.rating" class="row-start-2 flex gap-x-0.5">
        <template v-for="i in 5" :key="i">
          <component :is="i <= location.rating ? StarFilledIcon : StarIcon" class="w-3 h-3" />
        </template>
      </div>
    </template>
    <span v-else-if="location.isAtm" class="row-start-2 text-xs font-semibold text-white/70">
      <template v-if="location.accepts?.length > 0 && location.sells?.length > 0">{{
        $t('Buy & sell crypto')
      }}</template>
      <template v-else-if="location.accepts.length > 0">{{ $t('Sell crypto only') }}</template>
      <template v-else-if="location.sells.length > 0">{{ $t('Buy crypto only') }}</template>
    </span>
    <p
      class="text-xs leading-[1.5] grid-cols-1 col-span-3 row-start-3" :class="{
        'text-white/70': location.isAtm && location.isDark,
        'text-space/60': !location.isAtm || location.isLight,
        'truncate': progress === 0,
      }"
    >
      {{ location.address }}
    </p>
  </div>
</template>
