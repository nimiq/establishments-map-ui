<script setup lang="ts">
import { ModalName } from './Modal.vue';

const props = withDefaults(defineProps<{ nested?: boolean, questions?: string[] }>(), { nested: false, questions: () => [] })

const items = [
  {
    title: 'How is this data collected?',
    content: 'Our data is automatically collected from a variety of sources and then processed to match locations using the Google Maps Place API. While we strive for accuracy, please note that due to the automated nature of data collection, the information may not always be completely accurate.'
  },
  {
    title: 'How do I add a business to the map?',
    content: 'If you know of a business that accepts cryptocurrency that should be on our map, you can submit using the "Gear" icon next to the search bar and then clicking "Add business". Our team will review your submission to ensure it meets our standards before adding it to the map.'
  },
  {
    title: 'I spotted an error. How can I report it?',
    content: 'If you find any errors, such as a business that no longer accepts cryptocurrency or a location that no longer exists, please report it by opening the business information, then clicking on the options menu and then "Report". This will help us maintain accurate and trustworthy information for all users.'
  },
  {
    title: 'Why is this page protected by reCAPTCHA?',
    content: 'We use reCAPTCHA to protect our site from automated software and bots. This security measure helps us to ensure that interactions and submissions on our site are truly made by human users.'
  }, {
    title: 'What can I do if a location no longer accepts crypto?',
    content: 'If you find that a listed location is no longer accepting cryptocurrency, please report it by opening the business information, then clicking on the options menu and then "Report". This will help us maintain accurate and trustworthy information for all users.'
  }
].map(({ title, content }, i) => ({ title, content, value: `q-${i + 1}` }))

// Keep state of the open questions in the URL
const router = useRouter()
const route = useRoute()
const queryUrl: string | string[] = route.query.q || []
const questionsOpen = ref<string[]>(props.questions || (Array.isArray(queryUrl) ? toValue(queryUrl) : [queryUrl]))
watch(questionsOpen, (v) => requestAnimationFrame(() => router.push({ query: { ...route.query, q: v.length > 0 ? v : undefined } })), { deep: true })
onUnmounted(() => router.replace({ query: route.query, q: undefined }))
</script>

<template>
  <Modal :nested @close="questionsOpen = []" :name="ModalName.FAQ">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template #title>
      {{ $t('FAQ') }}
    </template>
    <template #description>
      <i18n-t keypath="If you need more details, feel free to reach us on {telegram}" tag="p">
        <template #telegram>
          <a href="https://t.me/nimiq" target="_blank" rel="noopener noreferrer" text-blue underline arrow
            text="Telegram" />
        </template>
      </i18n-t>
    </template>
    <template #content>
      <AccordionRoot v-model="questionsOpen" ml--16>
        <AccordionItem v-for="{ content, title, value } in items" :key="value" :value mt-16>
          <AccordionHeader accordion>
            <AccordionTrigger flex="~ gap-6 items-center" op="80 hocus:90 r-accordion-open:100" transition-opacity>
              <div i-nimiq:chevron-right text="10 neutral-700" r-accordion-open:rotate-90 delay-250 ease-out
                duration-300 op="0 r-accordion-hocus:100 r-accordion-open:100" />
              <h3 text-16 lh-none>{{ title }}</h3>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent of-hidden class="content" pl-16 pb-12 mt-4 text-14>
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
