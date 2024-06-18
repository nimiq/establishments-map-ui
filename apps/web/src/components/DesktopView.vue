<script setup lang="ts">
const { isListShown } = storeToRefs(useApp())
const { singlesInView, clustersInView } = storeToRefs(useMarkers())

const toggleList = useToggle(isListShown)
</script>

<template>
  <TheMapInstance h-screen w-screen />
  <!-- Shadow -->
  <div id="shadow-left" pointer-events-none absolute inset-0 max-w-368 from-neutral to-transparent bg-gradient-to-r />
  <aside pointer-events-none absolute inset-24 right-initial h-max max-w-384 children:pointer-events-auto flex="~ col">
    <!-- This element if for the shadow in the header. We cannot use a normal shadow because the use of mask-image restrict us of using shadows -->
    <div
      id="shadow" ring="1.5 neutral/3" pointer-events-none absolute inset-0 shadow
      style="height: calc(66px + var(--dynamic-block, 0) * 88px)"
    />
    <div id="wrapper" w-max bg-neutral-0>
      <InteractionBar>
        <template #search>
          <DesktopSearch />
        </template>
      </InteractionBar>
      <DesktopList :singles="singlesInView" :clusters="clustersInView" :list-is-shown="isListShown" />
    </div>
    <button
      ring="1.5 neutral/3" pill-sm z-10 mt-12 border-none pill-tertiary flex="~ gap-8"
      @click="() => toggleList()"
    >
      <div
        i-nimiq:chevron-down :class="{ 'rotate-180': isListShown }" text="10 op-70"
        transition="transform delay-500"
      />
      {{ $t(isListShown ? 'Hide list' : 'Show list') }}
    </button>
  </aside>
  <MapControls absolute bottom-24 right-24 />
  <FAQ name="faq" absolute bottom-6 left-78 rounded-4 bg-neutral-200 px-4 py-1 text-12 text-neutral font-bold ghost-btn>
    <template #trigger>
      FAQ
    </template>
  </FAQ>
</template>

<style scoped>
#shadow-left {
  will-change: transform;

  /* List or suggestions closed */
  transform: translateX(-100%);
  transition: transform 1000ms 75ms, opacity 300ms 75ms;
  opacity: 0;

  &:has(+ aside :is([data-state="open"]:not(#crypto-map-modal))) {
    /* List or suggestions opened */
    transform: translateX(0);
    transition: transform 500ms 100ms, opacity 300ms 100ms;
    opacity: 0.2;
  }
}

aside {
  #shadow {
    border-radius: 16px;
    transition: border-radius 75ms;

    &:has(+ #wrapper [data-suggestions]) {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  #wrapper {
    transition: border-radius 75ms;
    border-radius: 16px;

    &:not(:has([data-suggestions])) {
      mask-image: linear-gradient(white, white);
    }

    /*
  If the list is closed and there are suggestions, we need to remove the border-radius.
  We use double :has to make an AND gate
  in other words: If we have suggestions AND the list is closed.
  */
    &:has([data-suggestions]):has([data-state="open"]) {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
</style>
