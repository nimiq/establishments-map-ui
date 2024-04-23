export enum FormState {
  Initial = 'initial',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

interface UseFormOptions {
  url: URL
  body: ComputedRef<Record<string, any>>
}

const isEmpty = (value: any) => {
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return !value
}

export function useForm({ url, body }: UseFormOptions) {
  const state = ref<FormState>(FormState.Initial)
  const disabled = computed(() => Object.values(body.value).some(isEmpty))

  async function onSubmit() {
    if (disabled.value)
      return

    state.value = FormState.Loading

    const bodyStr = JSON.stringify({ ...body.value, captcha: await useCaptcha().getCaptchaToken() })
    const res = await fetch(url, { body: bodyStr, method: 'POST' })

    state.value = res?.ok ? FormState.Success : FormState.Error
  }

  function reset() {
    state.value = FormState.Initial
  }

  useInterval(5000, {
    callback: () => {
      // loop over states
      const states = [FormState.Loading, FormState.Success]
      const currentStateIndex = states.indexOf(state.value)
      const nextStateIndex = currentStateIndex + 1
      const nextState = states[nextStateIndex] || FormState.Initial
      state.value = nextState
    }
  })

  return {
    state,
    disabled,
    onSubmit,
    reset,
    isSuccess: computed(() => state.value === FormState.Success),
    isError: computed(() => state.value === FormState.Error),
  }
}
