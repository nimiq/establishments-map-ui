<script setup lang="ts">
import { layerStyle, mapStyle } from '@/assets/map-styles/ol-light.js'

const mapStore = useMap()
const { map } = storeToRefs(mapStore)

const isDark = useDark()
const styles = ref()

watch(isDark, async () => {
  const module = await import('@/assets/map-styles/dark')
  styles.value = module.default
}, { immediate: true })

const format = new (inject('ol-format')).MVT()

const url = '/tiles/{z}/{x}/{y}'
</script>

<template>
  <OlMap ref="map" size-screen>
    <OlView h-6xl :center="[40, 40]" :zoom="5" projection="EPSG:4326" />

    <OlTileLayer :style="mapStyle">
      <OlSourceOsm />
    </OlTileLayer>

    <OlVectorTileLayer :style="layerStyle">
      <OlSourceVectorTile :url :format />
    </OlVectorTileLayer>
  </OlMap>
</template>
