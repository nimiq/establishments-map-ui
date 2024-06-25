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
      <div flex="~ col gap-48 items-center">
        <div aria-hidden i-nimiq:logos-crypto-map mx-auto mt="8 desktop:20" text="64 desktop:94"
          @click.shift="() => toggleDark()" />
        <span font-bold text="20 desktop:24" lh-tight>{{ $t('Crypto Map') }}</span>
      </div>
    </template>

    <template #description>
      <i18n-t tag="p"
        keypath="This app is brought to you by {Nimiq}. It is protected by reCAPTCHA and the Google {privacyPolicy} and {termsOfService} apply."
        text="center 16 lh-24">
        <template #Nimiq><span text-blue font-bold>Nimiq</span></template>
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
      <LocationCandidate mt-32 />
      <div absolute top-20 left-20>
        <TriangleSelector v-model:selected="lang" :options="SUPPORTED_LANGUAGES" />
      </div>
    </template>
  </Modal>
</template>

<style>
div:has(> .modal-container) {
  background: rgb(var(--nq-neutral-0));

  .modal-container {
    background: linear-gradient(296deg, rgb(var(--nq-neutral) / 0.06) 18%, transparent 270px), white;
    z-index: 2;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      right: -7rem;
      top: -4.5rem;
      pointer-events: none;
      z-index: -1;
      --un-icon: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxLjEyZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjAgMTgiPjxnIGZpbGw9ImN1cnJlbnRDb2xvciI+PHBhdGggZmlsbD0idXJsKCNuaW1pcS1sb2dvcy1uaW1pcS1tb25vLTd2ZjJtcnJwbmNid2JocGZoeXF3NW8pIiBkPSJNMTkuNzM0IDguMTU2IDE1LjU3Ni44NDRBMS42NiAxLjY2IDAgMDAxNC4xMzUgMEg1LjgxOUM1LjIyNiAwIDQuNjc3LjMyIDQuMzguODQ0TC4yMjIgOC4xNTZhMS43MSAxLjcxIDAgMDAwIDEuNjg4bDQuMTU4IDcuMzEyYy4yOTcuNTIzLjg0Ni44NDQgMS40MzkuODQ0aDguMzE2Yy41OTMgMCAxLjE0Mi0uMzIgMS40MzgtLjg0NGw0LjE1OC03LjMxMmMuMy0uNTIzLjMtMS4xNjUuMDAzLTEuNjg4Ii8+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJuaW1pcS1sb2dvcy1uaW1pcS1tb25vLTd2ZjJtcnJwbmNid2JocGZoeXF3NW8iIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMTkuOTU2MiAwIDAgLTE4IDE5Ljk1NiAxOCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSJjdXJyZW50Q29sb3IiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9ImN1cnJlbnRDb2xvciIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjwvZz48L3N2Zz4=);
      -webkit-mask: var(--un-icon) no-repeat;
      mask: var(--un-icon) no-repeat;
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
      background-color: rgb(var(--nq-neutral-0));
      color: inherit;
      height: 90vh;
      aspect-ratio: 1;
    }
  }
}
</style>
