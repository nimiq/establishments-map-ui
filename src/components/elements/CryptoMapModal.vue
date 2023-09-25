<script setup lang="ts">
import Modal from '@/components/atoms/Modal.vue'
import Button from '@/components/atoms/Button.vue'
import LanguageSelector from '@/components/elements/LanguageSelector.vue'
import CryptoMapIcon from '@/components/icons/icon-crypto-map.vue'
import GearIcon from '@/components/icons/icon-gear.vue'

import { SUPPORTED_LANGUAGES, i18n, setLanguage } from '@/i18n/i18n-setup'

function _onLanguagesChange(language: string) {
  setLanguage(language)
}
</script>

<template>
  <Modal>
    <template #trigger="{ openModal }">
      <Button bg-color="transparent" size="md" @click="openModal">
        <template #icon>
          <GearIcon class="text-space/30 w-4.5 h-4.5" />
        </template>
      </Button>
    </template>

    <template #pre-title>
      <CryptoMapIcon class="h-8" />
    </template>

    <template #title>
      {{ $t('Crypto Map') }}
    </template>

    <template #content>
      <i18n-t class="[text-wrap:pretty]" tag="p" keypath="This app is brought to you by Nimiq. It is protected by reCAPTCHA and the Google {privacyPolicy} and {termsOfService} apply.">
        <template #privacyPolicy><a href="https://policies.google.com/privacy" target="_blank" rel="noopener" class="underline">{{ $t('Privacy Policy') }}</a></template>
        <template #termsOfService><a href="https://policies.google.com/terms" target="_blank" rel="noopener" class="underline">{{ $t('Terms of Service') }}</a></template>
      </i18n-t>

      <div class="flex items-center justify-between mt-8">
        <Button bg="sky" href="/location/add">
          <template #label>
            {{ $t('Add Crypto location') }}
          </template>
        </Button>

        <LanguageSelector :value="i18n.locale" :languages="SUPPORTED_LANGUAGES" @update:language="_onLanguagesChange" />
      </div>
    </template>
  </Modal>
</template>
