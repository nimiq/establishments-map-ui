<script setup lang="ts">
import { NuxtLayout } from '#components'
import { UuidSchema } from '~~/lib/schemas'
import { safeParse } from 'valibot'

if (import.meta.dev)
  useDark() // Take care of your eyes

defineRouteRules({ ssr: false, prerender: true })

const route = useRoute()

function getSelectedUuid() {
  const { output: uuid, success: uuidSuccess } = safeParse(UuidSchema, route.query.uuid)
  return uuidSuccess ? uuid : undefined
}

const maybeUuid = getSelectedUuid()
const { selectedUuid } = storeToRefs(useLocations())
if (maybeUuid)
  selectedUuid.value = maybeUuid
</script>

<template>
  <NuxtLayout name="desktop" />
</template>
