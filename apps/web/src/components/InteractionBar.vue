<script setup lang="ts">
const { cryptocityBanner, showSearchBoxHint } = useUIParams()
</script>

<template>
  <header flex="~ items-center gap-16" relative z-10 z-100 w-full p-24 pl-16 desktop:p-16>
    <div aria-hidden i-nimiq:logos-crypto-map shrink-0 text-24 />
    <slot name="search" />
    <CryptoMapModal id="crypto-map-modal" />
  </header>

  <!--
    This is the dynamic block.
    We will show the cryptocity information if the user is exploring the map in an area with a cryptocity
    Otherwise, we will show the "Search for locations" hint. Once the user searchs something, we will hide this hint.

    If the user has already search something and he is not on top of a cryptocity, we won't show anything.

    Note: We need to hardcode the height, otherwise the desktop list will break
  -->
  <div v-if="cryptocityBanner" h-88 w-full border-t bg-neutral-200 p-20 text-16 desktop:max-w-320 flex="~ gap-12">
    <div>
      <div i-nimiq:logos-cryptocity centered text-40>
        <PopoverRoot>
          <PopoverTrigger>
            <div i-nimiq:info text-14 text-neutral-700 />
          </PopoverTrigger>
          <PopoverPortal>
            <Transition name="slide-left">
              <PopoverContent
                as-child :side-offset="isMobile ? 4 : 280" :collision-padding="8"
                :side="isMobile ? 'top' : 'right'"
              >
                <div z-300 rounded-8 p-16 bg-gradient-neutral>
                  <div flex="~ gap-8 items-center" text-neutral-100 font-semibold>
                    <div size-40 rounded-full bg-neutral-0 p-4>
                      <div i-nimiq:logos-cryptocity text-32 />
                    </div>
                    {{ cryptocityBanner.name }}
                  </div>
                  <p mt-8 text-neutral-300>
                    {{ $t('The initiative for crypto-friendly cities.') }}
                  </p>
                  <a
                    :href="cryptocityBanner.url" target="_blank" mt-12 transition-colors pill-sm
                    bg-image="$nq-blue-on-dark-gradient hocus:$nq-blue-on-light-gradient-darkened"
                  >
                    {{ $t('Learn more') }}
                  </a>
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
    <i18n-t keypath="Spend {CriptocityPoints} at unique locations in this area." tag="p" text-neutral-800>
      <template #CryptocityPoints>
        <b>{{ $t('Cryptocity Points') }}</b>
      </template>
    </i18n-t>
  </div>

  <p v-else-if="showSearchBoxHint" h-88 max-w-320 border-t px-20 py-16 text-12 text-neutral-700>
    {{ $t(`Enter country, city or zip code to discover locations that accept Bitcoin, Nimiq and other
    crypto-currencies.`) }}
  </p>
</template>
