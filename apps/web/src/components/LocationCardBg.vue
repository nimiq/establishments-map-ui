<script setup lang="ts">
import { Location, Provider } from 'types'
import { getBannerIcon } from '@/composables/useIcon';

withDefaults(defineProps<{location: Location, withGradient?:boolean}>(), {withGradient: true})
</script>

<template>
  <template v-if="!location.isAtm">
    <div
      v-if="withGradient"
      absolute rounded-b-12 top-0 right-0 bg="[radial-gradient(100%_75.78%_at_100%_100%,#ffffff_0%,rgba(255,255,255,0)_100%)]" op-20 pointer-events-none w-full h-full
    />
    <div v-bind="$attrs" absolute bottom-0 right-0 z-20 of-hidden w-full h-full pointer-events-none>
      <div absolute right-2 bottom--3 bg="[url(@/assets/provider-rings-bg.svg)] [size:59px_59px] no-repeat" size-186>
        <div absolute p-6 rounded-full size-36 right-16 bottom-16 :bg="location.banner === 'Nimiq-Pay' ? 'neutral' : location.banner === Provider.NAKA ? 'b7ff00' : 'neutral-0'">
          <div :class="getBannerIcon(location.banner)" text-24 />
        </div>
      </div>
    </div>
  </template>

  <template v-if="location.isAtm">
    <div v-if="withGradient" absolute top-0 right-0 bg="[radial-gradient(100%_75.78%_at_100%_0%,#ffffff_0%,rgba(255,255,255,0)_100%)[]" op-20 pointer-events-none w-full h-full />
    <div v-bind="$attrs" absolute bottom-0 right-0 z-20 w-full h-full of-hidden pointer-events-none>
      <div absolute bottom--6 right--6 bg="[url(@/assets/atm-provider-rings-bg.svg)] [size:59_59px] no-repeat" size-118 />
      <div :class="getBannerIcon(location.banner)" text-8 absolute bottom-36 right-36 />
    </div>
  </template>
</template>
