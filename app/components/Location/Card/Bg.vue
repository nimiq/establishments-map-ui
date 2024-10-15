<script setup lang="ts">
const props = withDefaults(
  defineProps<{ location: MapLocation, banner?: LocationBanner, withGradient?: boolean }>(),
  { withGradient: true, useSecondaryBanner: false },
)

const banner = computed(() => {
  if (props.banner)
    return props.banner
  if (Array.isArray(props.location.banner))
    return props.location.banner[0]
  return props.location.banner
})
</script>

<template>
  <template v-if="!location.isAtm">
    <div
      v-if="withGradient" rounded-bl="[var(bottom-radius-bl,var(bottom-radius))]"
      rounded-br="[var(bottom-radius-br,var(bottom-radius))]"
      bg="[radial-gradient(100%_75.78%_at_100%_100%,#ffffff_0%,rgba(255,255,255,0)_100%)]" aria-hidden inert
      pointer-events-none absolute right-0 top-0 h-full w-full op-20
    />
    <div v-bind="$attrs" pointer-events-none absolute bottom-0 right-0 z-20 h-full w-full of-hidden>
      <div v-if="location.splitBanner" i-ring:provider-small absolute right-8 top-8 size-48 />
      <div v-else i-ring:provider absolute bottom--62 right--62 size-188 />
      <div
        absolute bottom-16 right-16 size-32 rounded-full :class="{
          'bg-neutral': banner?.type === 'Nimiq-Pay',
          'bg-[#b7ff00]': banner?.type === Provider.NAKA,
          'bg-neutral-0': banner?.type !== 'Nimiq-Pay' && banner?.type !== Provider.NAKA,
          'p-2 text-28': banner?.type === Provider.Opago || banner?.type === Provider.Osmo,
          'p-6 text-20': banner?.type !== Provider.Opago && banner?.type !== Provider.Osmo,
        }"
      >
        <div :class="banner?.icon" />
      </div>
    </div>
  </template>

  <template v-else>
    <div
      v-if="withGradient" inert bg="[radial-gradient(100%_75.78%_at_100%_0%,#ffffff_0%,rgba(255,255,255,0)_100%)]"
      pointer-events-none absolute right-0 top-0 h-full w-full op-20
    />
    <div v-bind="$attrs" pointer-events-none absolute bottom-0 right-0 z-20 h-full w-full of-hidden>
      <div aria-hidden i-ring:atm absolute bottom-16 right-16 size-59 />
      <div
        absolute bottom-32 right-32 centered rounded-full p-4 :class="{
          'bg-neutral': banner?.type === 'Nimiq-Pay',
        }"
      >
        <div :class="location?.cardStyle.icon" text-19 />
      </div>
    </div>
  </template>
</template>
