<script setup lang="ts">
const { isListShown } = storeToRefs(useApp())
const { singlesInView, clustersInView } = storeToRefs(useMarkers())

const toggleList = useToggle(isListShown)
</script>

<template>
  <TheMapInstance w-screen h-screen />
  <!-- Shadow -->
  <div id="shadow-left" absolute inset-0 max-w-368 pointer-events-none bg-gradient-to-r from-neutral to-transparent />
  <aside absolute max-w-384 inset-24 right-initial h-max pointer-events-none children:pointer-events-auto flex="~ col">
    <!-- This element if for the shadow in the header. We cannot use a normal shadow because the use of mask-image restrict us of using shadows -->
    <div absolute inset-0 shadow ring="1.5 neutral/3" pointer-events-none id="shadow"
      style="height: calc(66px + (88px * var(--search-box-hint)))" />
    <div w-max bg-neutral-0 id="wrapper">
      <InteractionBar>
        <template #search>
          <DesktopSearch />
        </template>
      </InteractionBar>
      <DesktopList :singles="singlesInView" :clusters="clustersInView" :list-is-shown="isListShown" />
    </div>
    <button mt-12 pill-tertiary border-none pill-sm ring="1.5 neutral/3" z-10 flex="~ gap-8"
      @click="() => toggleList()">
      <div i-nimiq:chevron-down :class="{ 'rotate-180': isListShown }" text="10 op-70"
        transition="transform delay-500" />
      {{ $t(isListShown ? 'Hide list' : 'Show list') }}
    </button>
  </aside>
  <MapControls absolute bottom-24 right-24 />
  <FAQ name="faq" absolute bottom-6 left-78 px-4 py-1 text-12 rounded-4 ghost-btn text-neutral font-bold bg-neutral-200>
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
