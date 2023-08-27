<script setup lang="ts">
import { type PropType, defineAsyncComponent } from 'vue'
import Button from '@/components/atoms/Button.vue'
import EllipsisVertical from '@/components/icons/icon-ellipsis-vertical.vue'
import StarFilledIcon from '@/components/icons/icon-star-filled.vue'
import StarIcon from '@/components/icons/icon-star.vue'
import { type Location, LocationLink } from '@/types'

defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
})

const GmapsPin = defineAsyncComponent(() => import('@/components/icons/icon-gmaps-pin.vue'))
</script>

<template>
  <div
    class="relative grid grid-cols-[auto_1fr_72px] grid-rows-[repeat(3,auto)] gap-x-1.5 items-center group/card" :class="{
      'text-white': location.bgFullCard && location.isDark,
      'text-space': !location.bgFullCard || location.isLight,
    }"
  >
    <h2 class="text-base font-bold leading-[1.3] col-span-2 pb-1 text-balance truncate">
      {{ location.name }}
    </h2>

    <div class="relative flex self-start row-span-2 ml-5 gap-x-3">
      <Button
        v-if="location.url" bg-color="white" :href="location.url" border-color="grey"
        class="transition-[top,right] !w-[52px] right-0 lg:opacity-0 lg:group-hover/card:opacity-100" size="sm" :style="{
          top: location.photo ? `-${progress * 184}px` : '',
          position: location.photo ? `absolute` : '',
        }"
      >
        <template #icon>
          <GmapsPin v-if="location.linkTo === LocationLink.GMaps" />
          <!-- TODO Add logos -->
          <span v-if="location.linkTo === LocationLink.Instagram">Instagram</span>
          <span v-if="location.linkTo === LocationLink.Facebook">Facebook</span>
        </template>
      </Button>

      <transition
        enter-active-class="right-0 transition duration-100 ease-out" enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-75 ease-out"
        leave-from-class="scale-100 opacity-100" leave-to-class="scale-95 opacity-0"
      >
        <Button
          bg-color="transparent" size="sm" class="lg:hidden invisible ml-auto !p-0 !w-1 !h-5 clickable" :class="{
            visible: progress > 0,
          }" :style="`width: ${progress * 4}px`"
        >
          <template #icon>
            <EllipsisVertical
              class="h-5" :class="{
                'text-white/50': location.bgFullCard && location.isDark,
                'text-space/30': !location.bgFullCard || location.isLight,
              }"
            />
          </template>
        </Button>
      </transition>
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
        'text-white/70': location.bgFullCard && location.isDark,
        'text-space/60': !location.bgFullCard || location.isLight,
        'truncate': progress === 0,
      }"
    >
      {{ location.address }}
    </p>
  </div>
</template>
