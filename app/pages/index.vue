<script setup lang="ts">
import { NuxtLayout } from '#components'
import { UuidSchema } from '~~/lib/schemas'
import { safeParse } from 'valibot'

if (import.meta.dev)
  useDark() // Take care of your eyes

defineRouteRules({ ssr: false })

const route = useRoute()

function getSelectedUuid() {
  const { output: uuid, success: uuidSuccess } = safeParse(UuidSchema, route.query.uuid)
  return uuidSuccess ? uuid : undefined
}

const maybeUuid = getSelectedUuid()
const { selectedUuid } = storeToRefs(useLocations())
if (maybeUuid)
  selectedUuid.value = maybeUuid

// Costa Rica
const FALLBACK_POSITION: MapPosition = { center: { lat: 9.6301892, lng: -84.2541844 }, zoom: 9 }

const { geolocateIp } = useGeoIp()
const { ipPositionError, ipPosition } = storeToRefs(useGeoIp())
const { setPosition } = useMap()

await geolocateIp()

if (!ipPositionError.value && ipPosition.value) {
  // eslint-disable-next-line no-console
  console.log(`Using user's location: ${JSON.stringify(ipPosition.value)}`)
  setPosition(ipPosition.value)
  navigateTo(`/@${ipPosition.value.center.lat},${ipPosition.value.center.lng},12z`)
}
else {
  console.warn(`Error getting user's location: ${ipPositionError.value}. Using fallback position. ${JSON.stringify(FALLBACK_POSITION)}`)
  navigateTo(`/@${FALLBACK_POSITION.center.lat},${FALLBACK_POSITION.center.lng},${FALLBACK_POSITION.zoom}z`)
}
</script>

<template>
  <NuxtLayout name="desktop" />
</template>
