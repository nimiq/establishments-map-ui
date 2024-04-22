<script setup lang="ts">
const items = [
  {
    value: 'q1',
    title: 'Where the data comes from?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc ultricies ultricies.'
  },
  {
    value: 'q2',
    title: 'How to report an issue?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc ultricies ultricies.'
  },
  {
    value: 'q3',
    title: 'How to find a location?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc ultricies ultricies.'
  }
]
</script>

<template>
  <AccordionRoot type="multiple" ml--16>
    <AccordionItem v-for="{ content, title, value } in items" :key="value" :value mt="first:16 4">
      <AccordionHeader>
        <AccordionTrigger flex="~ gap-6 items-center" accordion>
          <div i-nimiq:chevron-right text="10 neutral-700" r-accordion-open:rotate-90 delay="200 r-accordion-open:0" ease-out duration-300 op="0 r-accordion-hocus:100 r-accordion-open:100" />
          <h3 text-16>{{ title }}</h3>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent of-hidden class="content" pl-16 text-14>
        <p>{{ content }}</p>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
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
