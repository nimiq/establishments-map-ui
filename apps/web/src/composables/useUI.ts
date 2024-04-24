import { breakpointsTailwind } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'

export const isMobile = useBreakpoints(breakpointsTailwind).smaller('md')

export function getMapUiState() {
  const { zoom } = storeToRefs(useMap())
  return {
    fillMarker: computed(() => zoom.value >= 13),
    showLocationName: computed(() => zoom.value >= 11),
  }
}

export enum Layout {
  Default = 'default',

  // UI optimized for mobile devices, specially the Nimiq Pay App
  Compact = 'compact',
}

export function useLayout() {
  const layoutQuery = useRouteQuery<Layout | undefined>('layout', undefined, { route: useRoute() })

  const MobileView = defineAsyncComponent(() => import('@/components/MobileView.vue'))
  const DesktopView = defineAsyncComponent(() => import('@/components/DesktopView.vue'))
  const CompactView = defineAsyncComponent(() => import('@/components/CompactView.vue'))

  const component = computed(() => {
    switch (layoutQuery.value) {
      case Layout.Compact: return CompactView
      default: return isMobile.value ? MobileView : DesktopView
    }
  })

  return {
    component
  }
}
