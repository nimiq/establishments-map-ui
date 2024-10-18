<script setup lang="ts">
defineProps<{ location: MapLocation }>()

// For the banner Nimiq Pay, the label should be Nimiq Pay
function handleProviderPlaceholder({ provider }: MapLocation, { type }: LocationBanner) {
  if (type === 'Nimiq-Pay')
    return 'Nimiq Pay'
  return provider
}

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{ banner: LocationBanner }>()
</script>

<template>
  <footer relative>
    <DefineTemplate v-slot="{ banner }">
      <div
        :class="banner.label ? 'h-64' : 'h-36'" relative flex="~ items-center" text="white inverted:darkblue"
        :style="{ backgroundColor: banner.style?.bg?.(location.splitBanner) || 'transparent' }"
      >
        <LocationCardBg v-if="!location.isAtm && banner.label" :location :banner />

        <div
          v-if="banner.label || banner.shortLabel" flex="~ items-center gap-8" pt-6 text-12
          :class="{ 'pl-24 pr-72': !location.splitBanner, 'pl-16 pr-64': location.splitBanner }"
        >
          <p v-if="location.splitBanner" font-bold>
            {{ banner.shortLabel }}
          </p>
          <i18n-t v-else :keypath="banner.label!" tag="p">
            <!-- The name in the label can optionally be written bold by including a {provider} placeholder -->
            <template #provider>
              <b>{{ handleProviderPlaceholder(location, banner) }}</b>
            </template>
          </i18n-t>

          <PopoverRoot>
            <PopoverTrigger>
              <div i-nimiq:info text-14 op-80 />
            </PopoverTrigger>
            <PopoverPortal>
              <Transition name="slide-left">
                <PopoverContent as-child :side-offset="4" :collision-padding="8" :side="isMobile ? 'top' : 'right'">
                  <div z-100 max-w-320 rounded-6 p-16 text-neutral-0 shadow bg-gradient-neutral>
                    <header flex="~ items-center justify-start gap-8">
                      <div :class="banner.icon" shrink-0 text-24 />

                      <h4 truncate text-16 text-neutral-400 font-semibold lh-20>
                        {{ handleProviderPlaceholder(location, banner) }}
                      </h4>
                      <div v-if="banner.tooltipLabel" text="10 neutral-600" label ml-auto whitespace-nowrap>
                        {{ banner.tooltipLabel }}
                      </div>
                    </header>

                    <p text="14 neutral-600" mt-8>
                      {{ banner.tooltip }}
                    </p>

                    <a
                      v-if="banner.tooltipCta" :href="banner.tooltipCta" target="_blank" rel="noopener noreferrer"
                      un-text="14 neutral-600" mt-12 block nq-arrow before:op-80 flex="~ items-center"
                    >
                      <!-- {{ $t('Learn more') }} -->
                      Learn more
                    </a>

                    <template v-if="banner.appStore || banner.googlePlay">
                      <div flex="~ items-center gap-16" mt-16 text-45>
                        <!-- :aria-label="$t('Download on App Store')" -->
                        <a
                          v-if="banner.appStore" :href="banner.appStore" target="_blank" rel="noopener noreferrer"
                          aria-label="Download on App Store" i-apps:app-store flex-1
                        />
                        <a
                          v-if="banner.googlePlay" :href="banner.googlePlay" target="_blank" rel="noopener noreferrer"
                          aria-label="Download on Play Store" i-apps:google-play flex-1
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
      </div>
    </DefineTemplate>

    <div v-if="Array.isArray(location.banner)" grid="~ cols-[1fr_1fr]">
      <ReuseTemplate
        :banner="(location.banner as [LocationBanner, LocationBanner]).at(0)!"
        :class="{ 'rounded-bl-12': !isMobile }" style="--bottom-radius-bl: 0"
      />
      <ReuseTemplate
        :banner="(location.banner as [LocationBanner, LocationBanner]).at(1)!"
        :class="{ 'rounded-br-12': !isMobile }" style="--bottom-radius-br: 0"
      />
    </div>
    <ReuseTemplate v-else :banner="location.banner as LocationBanner" :class="{ 'rounded-b-12': !isMobile }" />
  </footer>
</template>
