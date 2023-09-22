<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import Button from '@/components/atoms/Button.vue'
import ArrowLeftIcon from '@/components/icons/icon-arrow-left.vue'
import ArrowLinkIcon from '@/components/icons/icon-arrow-link.vue'
import { useCaptcha } from '@/composables/useCaptcha'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  onSubmit: {
    type: Function,
    required: true,
  },
  showForm: {
    type: Boolean,
    default: true,
  },
})

const { getToken } = useCaptcha()

enum FormState {
  Initial = 'initial',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

const state = ref<FormState>(FormState.Initial)
const disabled = computed(
  () => [FormState.Loading, FormState.Success].includes(state.value) || props.disabled,
)

async function onSubmit() {
  if (disabled.value)
    return

  state.value = FormState.Loading
  const token = await getToken()
  props
    .onSubmit(token)
    .then((r: Response) => {
      if (r.ok)
        state.value = FormState.Success
      else
        state.value = FormState.Error
    })
    .catch(() => (state.value = FormState.Error))
}

const slots = useSlots()
function hasSlot(name: string) {
  return !!slots[name]
}
</script>

<template>
  <header class="flex items-center p-6 shadow-header gap-x-4">
    <img src="@/assets/logo.svg" :alt="$t('Crypto Map logo')" class="h-6">
    <Button href="/" bg-color="grey">
      <template #icon>
        <ArrowLeftIcon class="" />
      </template>
      <template #label>
        {{ $t('Back to the Map') }}
      </template>
    </Button>
  </header>
  <div
    class="flex flex-col h-full justify-center md:text-center w-[clamp(284px,768px,calc(100vw-3rem))] mx-auto min-h-[calc(100vh-80px)] max-md:justify-start py-8 md:py-24"
  >
    <transition
      mode="out-in" enter-active-class="transition duration-500 ease-out lg:duration-100" :enter-from-class="`opacity-0 ${state === FormState.Initial ? '-translate-x-12' : 'translate-x-12'
      }`" enter-to-class="translate-x-0 opacity-100" leave-active-class="transition duration-300 ease-in"
      leave-from-class="translate-x-0 opacity-100" :leave-to-class="`opacity-0 ${state === FormState.Initial ? 'translate-x-12' : '-translate-x-12'
      }`"
    >
      <main v-if="[FormState.Initial, FormState.Loading].includes(state)">
        <h1 v-if="hasSlot('title')" class="font-bold text-4xl lg:text-5xl text-space leading-[1.2]">
          <slot name="title" />
        </h1>
        <p v-if="hasSlot('description')" class="mt-6 font-semibold text-space/60 lg:mt-8">
          <slot name="description" />
        </p>

        <div
          v-if="hasSlot('link')"
          class="text-sky font-bold text-sm group flex justify-center items-center gap-x-1.5 mt-4"
        >
          <slot name="link" />
          <ArrowLinkIcon class="w-2.5 h-2.5 group-hover:left-0.5 group-hover:-top-0.5 transition-all duration-300" />
        </div>

        <form v-if="hasSlot('form')" class="text-left transition-[opacity,transform] mt-14 lg:mt-16 delay-200" :class="showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'" @submit.prevent="onSubmit">
          <slot name="form" />

          <Button
            bg-color="ocean" type="submit" class="mx-auto mt-10" size="lg" :loading="state === FormState.Loading"
            :disabled="disabled"
          >
            <template #label>
              <slot name="button-label">
                {{ $t('Send') }}
              </slot>
            </template>
          </Button>
        </form>
      </main>

      <main v-else-if="state === FormState.Success">
        <h1 v-if="hasSlot('success-title')" class="font-bold text-4xl lg:text-5xl text-space leading-[1.2]">
          <slot name="success-title" />
        </h1>
        <p v-if="hasSlot('success-description')" class="mt-6 font-semibold text-space/60 lg:mt-8">
          <slot name="success-description" />
        </p>
        <Button v-if="hasSlot('success-button-label')" bg-color="ocean" class="mx-auto mt-10" size="lg" href="/">
          <template #label>
            <slot name="success-button-label">
              {{ $t('Back to the Map') }}
            </slot>
          </template>
        </Button>
      </main>

      <main v-else-if="state === FormState.Error">
        <h1 v-if="hasSlot('error-title')" class="font-bold text-4xl lg:text-5xl text-space leading-[1.2]">
          <slot name="error-title" />
        </h1>
        <p v-if="hasSlot('error-description')" class="mt-6 font-semibold text-space/60 lg:mt-8">
          <slot name="error-description" />
        </p>
        <Button
          v-if="hasSlot('error-button-label')" bg-color="ocean" class="mx-auto mt-10" size="lg"
          @click="state = FormState.Initial"
        >
          <template #label>
            <slot name="error-button-label">
              {{ $t('Try again') }}
            </slot>
          </template>
        </Button>
      </main>
    </transition>
  </div>
</template>
