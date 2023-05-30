<script setup lang="ts">
import Button from '@/components/elements/Button.vue';
import CryptoList from "@/components/elements/CryptoList.vue";
import FlagIcon from "@/components/icons/icon-flag.vue";
import IconGmapsPin from '@/components/icons/icon-gmaps-pin.vue';
import StarFilledIcon from "@/components/icons/icon-star-filled.vue";
import StarIcon from "@/components/icons/icon-star.vue";
import type { Establishment } from '@/stores/establishments';
import { computed } from 'vue';


const props = defineProps<{
  establishment: Establishment
}>()

const gmapsCategory = computed(() => {
  return props.establishment.gmapsTypes.length > 0 ? props.establishment.gmapsTypes[0] : props.establishment.category
})

/**
 * For now we only support in the UI establishments that have only a provider
 */
const provider = computed(() => props.establishment.providers.length ? props.establishment.providers[0] : undefined)
const isDefaultProvider = computed(() => provider.value?.name === 'DEFAULT')
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg">

    <div class="grid grid-cols-1 grid-rows-1 p-1.5 pb-0">
      <img :src="props.establishment.photoUrl" class="w-full aspect-[1.77] rounded-md" :alt="props.establishment.name"
        loading="lazy">
      <Button :href="props.establishment.gmapsUrl" bg-color="white" class="absolute top-3.5 right-3.5">
        <template #label>
          <IconGmapsPin />
        </template>
      </Button>
    </div>

    <div class="px-6 pt-5">
      <div class="grid justify-between grid-cols-[1fr,auto] gap-x-2 mb-6">
        <h2 class="text-base font-bold leading-[1.3]">{{ establishment.name }}</h2>
        <Button :href="`/establishment/${establishment.uuid}/report`" bg-color="white" hide-icon
          class="!w-7 !h-7 ring-1 ring-space/10 row-span-2">
          <template #label>
            <FlagIcon class="mx-auto text-space w-3.5" />
          </template>
        </Button>
        <div v-if="props.establishment.hasAllInfo" class="flex gap-x-1.5 items-baseline mt-1 grid-cols-1">
          <span class="text-xs font-semibold capitalize text-space/60">{{ gmapsCategory }}</span>
          <div class="flex gap-x-0.5">
            <template v-for="i in 5" :key="i">
              <component class="w-3 h-3" :is="i <= props.establishment.rating ? StarFilledIcon : StarIcon" />
            </template>
          </div>
        </div>
        <p class="text-xs leading-[1.5] text-space/60 grid-cols-1 col-span-2">
          {{ establishment.address }}
        </p>
      </div>

      <div :class="{ 'pb-6': isDefaultProvider }" class="flex gap-x-3">
        <CryptoList v-if="provider" :cryptos="provider.buy" :label="provider.sell?.length > 0 ? $t('Buy') : undefined"
          :max="provider.sell?.length > 0 ? 3 : 6" />
        <CryptoList v-if="provider && provider.sell?.length > 0" :cryptos="provider.sell" :label="$t('Sell')" :max="3" />
      </div>
    </div>
  </div>
  <!-- class="shadow-lg border pt-1.5 pb-6 rounded-lg flex flex-col break-inside-avoid-column transition-[box-shadow]" -->
</template>
