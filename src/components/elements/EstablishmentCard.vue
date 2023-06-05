<script setup lang="ts">
import Button from '@/components/elements/Button.vue';
import CryptoList from "@/components/elements/CryptoList.vue";
import FlagIcon from "@/components/icons/icon-flag.vue";
import IconGmapsPin from '@/components/icons/icon-gmaps-pin.vue';
import StarFilledIcon from "@/components/icons/icon-star-filled.vue";
import StarIcon from "@/components/icons/icon-star.vue";
import type { BaseEstablishment, Establishment } from '@/stores/establishments';
import { computed } from 'vue';


const props = defineProps<{
  establishment: Establishment | BaseEstablishment
}>()

const gmapsCategory = computed(() => {
  if (!props.establishment.hasAllInfo) return ''
  return props.establishment.gmapsTypes.length > 0 ? props.establishment.gmapsTypes[0] : props.establishment.category
})

/**
 * For now we only support in the UI establishments that have only a provider
 */
const provider = computed(() => props.establishment.hasAllInfo && props.establishment.providers.length ? props.establishment.providers[0] : undefined)
const isDefaultProvider = computed(() => provider.value?.name === 'DEFAULT')
</script>

<template>
  <div class="pb-6 bg-white rounded-lg shadow-lg">
    <div class="grid grid-cols-1 grid-rows-1 p-1.5 pb-0 relative">
      <template v-if="establishment.hasAllInfo">
        <img :src="establishment.photoUrl" class="w-full aspect-[1.77] rounded-md object-cover" :alt="establishment.name"
          loading="lazy">
        <Button :href="establishment.gmapsUrl" bg-color="white"
          class="absolute top-3.5 right-3.5 [&_[data-icon]>svg]:w-3 [&_[data-icon]>svg]:h-3" layout="label-icon">
          <template #label>
            <IconGmapsPin />
          </template>
        </Button>
      </template>
      <div v-else class="w-full aspect-[1.77] bg-space/[0.15] rounded-md animate-pulse" />
    </div>

    <div class="px-6 pt-5">
      <div class="grid justify-between grid-cols-[1fr,auto] gap-x-2 mb-6">
        <h2 class="text-base font-bold leading-[1.3]">{{ establishment.name }}</h2>
        <Button :href="`/establishment/${establishment.uuid}/report`" bg-color="white" hide-icon
          class="!w-7 !h-7 ring-1 ring-space/10 row-span-2" v-if="establishment.hasAllInfo">
          <template #label>
            <FlagIcon class="mx-auto text-space w-3.5" />
          </template>
        </Button>
        <div v-if="establishment.hasAllInfo" class="flex gap-x-1.5 items-baseline mt-1 grid-cols-1">
          <span class="text-xs font-semibold capitalize text-space/60">{{ gmapsCategory }}</span>
          <div class="flex gap-x-0.5">
            <template v-for="i in 5" :key="i">
              <component class="w-3 h-3" :is="i <= establishment.rating ? StarFilledIcon : StarIcon" />
            </template>
          </div>
        </div>
        <p class="text-xs leading-[1.5] text-space/60 grid-cols-1 col-span-2" v-if="establishment.hasAllInfo">
          {{ establishment.address }}
        </p>
        <div v-else class="text-xs leading-[1.5] text-space/60 grid-cols-1 col-span-2">
          Loading...
        </div>
      </div>

      <div class="flex gap-x-3" v-if="establishment.hasAllInfo">
        <CryptoList v-if="provider" :cryptos="provider.buy" :label="provider.sell?.length > 0 ? $t('Buy') : undefined"
          :max="provider.sell?.length > 0 ? 3 : 6" />
        <CryptoList v-if="provider && provider.sell?.length > 0" :cryptos="provider.sell" :label="$t('Sell')" :max="3" />
      </div>
      <!-- TODO Loading crypto component -->
    </div>
  </div>
  <!-- class="shadow-lg border pt-1.5 pb-6 rounded-lg flex flex-col break-inside-avoid-column transition-[box-shadow]" -->
</template>
