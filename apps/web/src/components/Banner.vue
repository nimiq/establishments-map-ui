<script setup lang="ts">
defineProps<{ location: MapLocation }>()

// For the banner Nimiq Pay, the label should be Nimiq Pay
function handleProviderPlaceholder({ banner, provider }: MapLocation) {
  if (banner === 'Nimiq-Pay')
    return 'Nimiq Pay'
  return provider
}
</script>

<template>
  <footer relative flex="~ items-center" :class="location.bannerLabel ? 'h-64' : 'h-36'">
    <LocationCardBg v-if="!location.isAtm && location.bannerLabel" :location="location" />

    <div v-if="location.bannerLabel" flex="~ items-center gap-8" pl-24 pr-72 pt-6 text-12>
      <i18n-t :keypath="location.bannerLabel" tag="p" text-neutral-50>
        <!-- The name in the label can optionally be written bold by including a {provider} placeholder -->
        <template #provider>
          <b>{{ handleProviderPlaceholder(location) }}</b>
        </template>
      </i18n-t>

      <PopoverRoot>
        <PopoverTrigger>
          <div i-nimiq:info text="14 neutral-0/50 inverted:neutral/50" />
        </PopoverTrigger>
        <PopoverPortal>
          <Transition name="slide-left">
            <PopoverContent as-child :side-offset="4" :collision-padding="8" :side="isMobile ? 'top' : 'right'">
              <div z-100 max-w-320 rounded-6 p-16 text-neutral-0 shadow bg-gradient-neutral>
                <header flex="~ items-center justify-start gap-8">
                  <div :class="getBannerIcon(location.banner)" shrink-0 text-24 />

                  <h4 truncate text-16 text-neutral-400 font-semibold lh-20>
                    {{ handleProviderPlaceholder(location) }}
                  </h4>
                  <div v-if="location.bannerTooltipLabel" ml-auto text="10 neutral-600" whitespace-nowrap label>
                    {{ location.bannerTooltipLabel }}
                  </div>
                </header>

                <p text="14 neutral-600" mt-8>
                  {{ location.bannerTooltip }}
                </p>

                <a
                  v-if="location.bannerTooltipCta" :href="location.bannerTooltipCta" target="_blank"
                  rel="noopener noreferrer" un-text="14 neutral-600" mt-12 block arrow before:op-80
                  flex="~ items-center"
                >
                  {{ $t('Learn more') }}
                </a>

                <template v-if="location.bannerAppStore || location.bannerGooglePlay">
                  <div flex="~ items-center gap-24" mt-16 text-40>
                    <a
                      v-if="location.bannerAppStore" :href="location.bannerAppStore" target="_blank"
                      rel="noopener noreferrer" :aria-label="$t('Download on App Store')" i-apps:app-store flex-1
                    />
                    <a
                      v-if="location.bannerGooglePlay" :href="location.bannerGooglePlay" target="_blank"
                      rel="noopener noreferrer" :aria-label="$t('Download on Play Store')" i-apps:google-play flex-1
                    />
                  </div>
                </template>
              </div>

              <PopoverArrow as-child>
                <div aria-hidden i-nimiq:tooltip-triangle h-8 w-16 rotate-180 text-neutral />
              </PopoverArrow>
            </PopoverContent>
          </Transition>
        </PopoverPortal>
      </PopoverRoot>
    </div>
  </footer>
</template>
