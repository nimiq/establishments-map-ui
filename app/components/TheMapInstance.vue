<script setup lang="ts">
import { mapStyle } from '@/assets/map-styles/ol-light.js'

import { Circle as CircleStyle, Stroke, Style } from 'ol/style.js'

const mapStore = useMap()
const { map } = storeToRefs(mapStore)

const format = new (inject('ol-format')).GeoJSON({ dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })
const url = '/tiles/{z}/{x}/{y}'

const image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({ color: 'red', width: 1 }),
})

const styleFunction = function () {
  return { Point: new Style({ image }) }
}
</script>

<template>
  <OlMap ref="map" size-screen>
    <OlView h-6xl :center="[100, -50]" :zoom="4" projection="EPSG:3857" />

    <OlTileLayer :style="mapStyle">
      <OlSourceOsm />
    </OlTileLayer>
    <!-- <ol-tile-layer>
      <ol-source-tile-debug />
    </ol-tile-layer> -->

    <!-- <ol-vector-tile-layer background="rgba(0,255,255,0.5)">
      <ol-source-vector-tile :url="urlD" :format="mvtFormatD" />
    </ol-vector-tile-layer> -->

    <OlVectorTileLayer :style="styleFunction">
      <OlSourceVectorTile :url :format />
    </OlVectorTileLayer>
  </OlMap>
</template>
