<script setup lang="ts">
import type { PropType } from 'vue'
import { Popover } from 'radix-vue/namespaced'
import { useBreakpoints } from '@vueuse/core'
import { breakpointsTailwind } from '@vueuse/core'
import type { Location } from 'types'
import CardBg from '@/components/cards/location/LocationCardBg.vue'
import Button from '@/components/atoms/Button.vue'
import InfoIcon from '@/components/icons/icon-info.vue'
import BannerCircleLogo from '@/components/icons/providers/BannerCircleLogo.vue'

defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
  isAtm: {
    type: Boolean,
    default: false,
  },
})

const isMobile = useBreakpoints(breakpointsTailwind).smaller('md')

// For the banner Nimiq Pay, the label should be Nimiq Pay
function handleProviderPlaceholder({banner, provider}: Location) {
  if (banner === 'Nimiq-Pay') return 'Nimiq Pay'
  return provider

}
</script>

<template>
  <footer class="relative flex items-center" :class="{ 'h-16': location.bannerLabel, 'h-9': !location.bannerLabel }">
    <CardBg v-if="!location.isAtm && location.bannerLabel" :location="location" />

    <div v-if="location.bannerLabel" class="z-20 flex items-center pt-1.5 pl-6 pr-[72px] text-xs gap-x-1.5">
      <i18n-t
        :keypath="location.bannerLabel" tag="p" :class="{
          'text-white/60 [&>b]:text-white': location.isDark,
          'text-space/60 [&>b]:text-space': location.isLight,
        }"
      >
        <!-- The name in the label can optionally be written bold by including a {provider} placeholder -->
        <template #provider>
          <b>{{ handleProviderPlaceholder(location) }}</b>
        </template>
      </i18n-t>

      <Popover.Root :delay-duration="300">
        <Popover.Trigger>
          <InfoIcon class="w-4" :class="{ 'text-white/50': location.isDark, 'text-space/50': location.isLight }" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            as-child
            class="max-w-xs p-4 space-y-2 text-white rounded-sm shadow z-100 bg-gradient-space [&[data-side=right]_[data-arrow]]:right-1.5  [&[data-side=left]_[data-arrow]]:left-1.5"
            :side-offset="4" :collision-padding="8" :side="isMobile ? 'top' : 'right'"
          >
            <div>
              <header class="flex items-center justify-start gap-x-2">
                <BannerCircleLogo :banner="location.banner" />
                <h4 class="font-semibold truncate [text-wrap:balance]">
                  {{ handleProviderPlaceholder(location) }}
                </h4>
                <div
                  v-if="location.bannerTooltipLabel"
                  class="ml-auto uppercase text-xs text-white/60 tracking-wider bg-white/[0.08] shadow-sm shadow-white/[0.2] font-semibold px-2 py-0.5 ring-1 ring-white/20 rounded-full"
                >
                  {{ location.bannerTooltipLabel }}
                </div>
              </header>

              <p class="mt-2 text-sm text-white/60 text-pretty">
                {{ location.bannerTooltip }}
              </p>

              <Button
                v-if="location.bannerTooltipCta" :href="location.bannerTooltipCta" bg-color="transparent"
                text-color="white" class="!px-0 opacity-60"
              >
                <template #label>
                  {{ $t('Learn more') }}
                </template>
              </Button>

              <template v-if="location.bannerAppStore || location.bannerGooglePlay">
                <div class="flex items-center gap-6 text-white/70 !mt-4">
                  <a v-if="location.bannerAppStore" :href="location.bannerAppStore" target="_blank" rel="noopener noreferrer" class="flex-1">
                    <img src="@/assets/app-store-badge.svg" :alt="$t('Download on App Store')" class="w-full" />
                  </a>
                  <a v-if="location.bannerGooglePlay" :href="location.bannerGooglePlay" target="_blank" rel="noopener noreferrer" class="flex-1">
                    <img src="@/assets/google-play-badge.svg" :alt="$t('Download on Play Store')" class="w-full" />
                  </a>
                </div>
              </template>
              <Popover.Arrow data-arrow class="fill-space desktop:relative" size="10" />

              <!-- TODO Once this is fixed https://github.com/radix-vue/radix-vue/issues/353 use custom arrow -->
              <!-- <PopoverArrow as-child>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 10" class="relative h-3 text-space w-max left-2" :style="`color: ${location.bg}`">
                    <path
                      fill="currentColor"
                      d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z"
                    />
                  </svg>
                </PopoverArrow> -->
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  </footer>
</template>
