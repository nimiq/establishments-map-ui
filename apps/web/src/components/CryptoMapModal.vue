<script setup lang="ts">
import { ModalName } from './Modal.vue'

const lang = ref(i18n.locale)
watch(lang, () => setLanguage(lang.value))

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <Modal :name="ModalName.CryptoMap">
    <template #trigger>
      <div bg="neutral-0 hover:neutral-200" group mx--8 rounded-full p-8 transition-colors>
        <div text="neutral-600 group-hover:neutral-700" i-nimiq:gear text-18 transition-colors />
      </div>
    </template>

    <template #title>
      <div flex="~ gap-12 items-center">
        <div aria-hidden i-nimiq:logos-crypto-map text-26 @click.shift="() => toggleDark()" />
        {{ $t('Crypto Map') }}
      </div>
    </template>

    <template #description>
      <i18n-t
        tag="p"
        keypath="This app is brought to you by Nimiq. It is protected by reCAPTCHA and the Google {privacyPolicy} and {termsOfService} apply."
      >
        <template #privacyPolicy>
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" text-neutral-800 underline>
            {{ $t('Privacy Policy') }}
          </a>
        </template>
        <template #termsOfService>
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener" text-neutral-800 underline>
            {{ $t('Terms of Service') }}
          </a>
        </template>
      </i18n-t>
    </template>

    <template #content>
      <div flex="~ items-center justify-between" mt-32>
        <LocationCandidate />
        <TriangleSelector v-model:selected="lang" :options="SUPPORTED_LANGUAGES" />
      </div>
    </template>
  </Modal>
</template>
