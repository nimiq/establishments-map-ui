<script setup lang="ts">
import { ModalName } from './Modal.vue';

withDefaults(defineProps<{ nested?: boolean }>(), { nested: false })

const items = [
  {
    title: 'Where the data comes from?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc ultricies ultricies.'
  },
  {
    title: 'How to report an issue?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc ultricies ultricies.'
  },
  {
    title: 'How to find a location?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc ultricies ultricies.'
  }
].map(({ title, content }, i) => ({ title, content, value: `q-${i}` }))

// Keep state of the open questions in the URL
const router = useRouter()
const route = useRoute()
const queryUrl: string | string[] = route.query.q || []
const questionsOpen = ref<string[]>(Array.isArray(queryUrl) ? toValue(queryUrl) : [queryUrl])
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
          <a href="https://t.me/nimiq" target="_blank" rel="noopener noreferrer" text-blue underline arrow>
            Telegram
          </a>
        </template>
      </i18n-t>
    </template>
    <template #content>
      <AccordionRoot v-model="questionsOpen" ml--16>
        <AccordionItem v-for="{ content, title, value } in items" :key="value" :value mt="first:16 4">
          <AccordionHeader>
            <AccordionTrigger flex="~ gap-6 items-center" accordion>
              <div i-nimiq:chevron-right text="10 neutral-700" r-accordion-open:rotate-90 delay-250 ease-out
                duration-300 op="0 r-accordion-hocus:100 r-accordion-open:100" />
              <h3 text-16>{{ title }}</h3>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent of-hidden class="content" pl-16 text-14>
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
