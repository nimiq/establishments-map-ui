<script setup lang="ts">
import { ModalName } from './Modal.vue'

const props = withDefaults(defineProps<{ nested?: boolean, questions?: string[] }>(), { nested: false, questions: () => [] })

const items = [
  {
    title: i18n.t('Data collection'),
    content: i18n.t('Our data is gathered from various sources and processed to align with locations using the Google Maps Place API. Although we strive for accuracy, automated collection can sometimes result in errors.'),
  },
  {
    title: i18n.t('How to add a business'),
    content: i18n.t('To add a business that accepts cryptocurrency to our map, click the "Gear" icon next to the search bar, then "Add business." We will review submissions to ensure compliance with our standards.'),
  },
  {
    title: i18n.t('How to report errors'),
    content: i18n.t('If you find any errors like e.g. a business that no longer accepts cryptocurrency or has changed locations, open the business information, select the options menu, and click "Report.'),
  },
  {
    title: i18n.t('A business on the map does not accept crypto'),
    content: i18n.t('If a business no longer accepts crypto, open the business information, go to the options menu, and click on "Report." This helps us keep our information accurate.'),
  },
].map(({ title, content }, i) => ({ title, content, value: `q-${i + 1}` }))

// Keep state of the open questions in the URL
const router = useRouter()
const route = useRoute()
const queryUrl: string | string[] = route.query.q || []
const questionsOpen = ref<string[]>(props.questions || (Array.isArray(queryUrl) ? toValue(queryUrl) : [queryUrl]))
watch(questionsOpen, v => requestAnimationFrame(() => router.push({ query: { ...route.query, q: v.length > 0 ? v : undefined } })), { deep: true })
onUnmounted(() => router.replace({ query: route.query, q: undefined }))
</script>

<template>
  <Modal :nested :name="ModalName.FAQ" @close="questionsOpen = []">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template #title>
      {{ $t('FAQ') }}
    </template>
    <template #description>
      <i18n-t keypath="If you need more details, feel free to reach us on {telegram}" tag="span">
        <template #telegram>
          <a href="https://t.me/nimiq" target="_blank" rel="noopener noreferrer" un-text="bold blue" arrow>
            Telegram
          </a>
        </template>
      </i18n-t>
    </template>
    <template #content>
      <AccordionRoot v-model="questionsOpen">
        <AccordionItem v-for="{ content, title, value } in items" :key="value" :value mt-16>
          <AccordionHeader accordion>
            <AccordionTrigger flex="~ gap-6 items-center" op="80 hocus:90 r-accordion-open:100" transition-opacity>
              <h3 text="16/none">
                {{ title }}
              </h3>
              <div text="12 neutral-700" i-nimiq:chevron-right duration-300 delay-250 ease-out
                r-accordion-open:rotate-90 op="0 r-accordion-hocus:100 r-accordion-open:100" />
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent class="content" mt-8 of-hidden pb-12 text="16/24">
            <p>{{ content }}</p>
          </AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    </template>
  </Modal>
</template>

<style scoped>
.content {

  &:is([data-state="open"]) {
    animation: slide-up 200ms var(--nq-ease);
  }

  &:is([data-state="closed"]) {
    animation: slide-down 150ms var(--nq-ease);
  }
}

@keyframes slide-up {
  from {
    height: 0;
  }

  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes slide-down {
  from {
    height: var(--radix-accordion-content-height);
  }

  to {
    height: 0;
  }
}
</style>
