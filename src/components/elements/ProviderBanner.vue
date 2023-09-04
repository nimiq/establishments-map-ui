<script setup lang="ts">
import type { PropType } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'radix-vue'
import { useBreakpoints } from '@vueuse/core'
import { screens } from 'tailwindcss-nimiq-theme'
import type { Location } from 'types'
import CardBg from '@/components/elements/CardBg.vue'
import Button from '@/components/atoms/Button.vue'
import InfoIcon from '@/components/icons/icon-info.vue'
import ProviderCircleLogo from '@/components/icons/providers/ProviderCircleLogo.vue'

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

const isMobile = useBreakpoints(screens).smaller('md')
</script>

<template>
  <footer class="relative flex items-center" :class="{ 'h-16': location.providerLabel, 'h-9': !location.providerLabel }">
    <CardBg v-if="!location.isAtm && location.providerLabel" :location="location" />

    <div v-if="location.providerLabel" class="z-20 flex items-center pt-1.5 pl-6 pr-[72px] text-xs gap-x-1.5">
      <i18n-t
        :keypath="location.providerLabel" tag="p" :class="{
          'text-white/60 [&>b]:text-white': location.isDark,
          'text-space/60 [&>b]:text-space': location.isLight,
        }"
      >
        <!-- The name in the label can optionally be written bold by including a {provider} placeholder -->
        <template #provider>
          <b>{{ location.provider }}</b>
        </template>
      </i18n-t>

      <TooltipProvider :delay-duration="300">
        <TooltipRoot>
          <TooltipTrigger>
            <InfoIcon :class="{ 'text-white/50': location.isDark, 'text-space/50': location.isLight }" />
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent
              as-child
              class="max-w-xs p-4 space-y-2 text-white rounded-sm shadow z-100 bg-gradient-space"
              :side-offset="4"
              :align-offset="40"
              :side="isMobile ? 'top' : 'right'"
            >
              <div>
                <header class="flex items-center justify-start gap-x-2">
                  <ProviderCircleLogo :provider="location.provider" />
                  <h4 class="font-semibold truncate">
                    {{ location.provider }}
                  </h4>
                </header>

                <p class="mt-2 text-sm text-white/60">
                  {{ location.providerTooltip }}
                </p>

                <Button v-if="location.providerTooltipCta" :href="location.providerTooltipCta" bg-color="transparent" text-color="white" class="!px-0 opacity-60">
                  <template #label>
                    {{ $t('Learn more') }}
                  </template>
                </Button>

                <!-- The use of -ml-3 it is a hack to position it centered -->
                <TooltipArrow class=" fill-space" size="10" :class="!isMobile && '-ml-3'" />

                <!-- TODO Once this is fixed https://github.com/radix-vue/radix-vue/issues/353 use custom arrow -->
                <!-- <TooltipArrow as-child>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 10" class="relative h-3 text-space w-max left-2" :style="`color: ${location.bg}`">
                    <path
                      fill="currentColor"
                      d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z"
                    />
                  </svg>
                </TooltipArrow> -->
              </div>
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </TooltipProvider>
    </div>
  </footer>
</template>
