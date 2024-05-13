import { type ConfigurableWindow, defaultWindow } from '@vueuse/core'
import type { MaybeRefOrGetter } from 'vue'

export type UseCarouselOptions = ConfigurableWindow & {
  columnGap?: number
  scrollBehavior?: ScrollBehavior
}

export function useCarousel(scroller: MaybeRefOrGetter<HTMLElement | null | undefined>, slideWidth: number, options: UseCarouselOptions = {}) {
  const { window = defaultWindow, columnGap = 0, scrollBehavior = 'smooth' } = options
  const elRef = computed(() => unrefElement(scroller) || window?.document?.documentElement)
  const activeIndex = ref(0)

  function calculateActiveIndex() {
    if (!elRef.value)
      return
    activeIndex.value = Math.round(elRef.value.scrollLeft / (slideWidth + (columnGap * 2)))
  }

  function goToSlide(index: number) {
    if (!elRef.value)
      return
    elRef.value!.scrollTo({
      top: 0,
      left: (slideWidth + (columnGap * 2)) * index,
      behavior: scrollBehavior,
    })
  }

  useScroll(elRef, { throttle: 50, onScroll: calculateActiveIndex, eventListenerOptions: { passive: true } })

  return {
    activeIndex,
    goToSlide,
    nextSlide: () => goToSlide(activeIndex.value + 1),
    prevSlide: () => goToSlide(activeIndex.value - 1),
  }
}
