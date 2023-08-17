import { useBreakpoints as _useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'
import { screens } from 'tailwindcss-nimiq-theme'

export function useBreakpoints() {
  const useBreakpoints = _useBreakpoints(screens)
  const smallScreen = useBreakpoints.smaller('sm')
  const largeScreen = useBreakpoints.greater('lg')
  const xlScreen = useBreakpoints.greater('xl')
  const mediumScreen = computed(() => !smallScreen.value && !largeScreen.value) // Using useBreakpoints.between('sm', 'lg') doesn't work
  return { ...useBreakpoints, smallScreen, mediumScreen, largeScreen, xlScreen }
}
