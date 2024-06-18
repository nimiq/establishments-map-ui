import { authenticateAnonUser } from 'database'
import { createSharedComposable } from '@vueuse/core'
import { DATABASE_ARGS } from '@/shared'

const CAPTCHA_TOKEN_VALIDITY = 10 * 60 * 1000 // 10 minutes for the captcha token
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

function _useCaptcha() {
  const token = ref<string>()
  const captchaUuid = ref<string>()
  const lock = ref(Promise.resolve()) // Lock to prevent multiple requests

  async function getCaptchaToken() {
    while (!globalThis.grecaptcha || !globalThis.grecaptcha.execute)
      await new Promise(resolve => setTimeout(resolve, 100))
    token.value = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'idle' })

    setTimeout(() => token.value = undefined, 60 * 1000)

    // eslint-disable-next-line no-console
    console.group('🤖 Got captcha token')
    // eslint-disable-next-line no-console
    console.log(token.value.slice(0, 7), '...', token.value.slice(-7))
    // eslint-disable-next-line no-console
    console.groupEnd()

    return token.value
  }

  async function getAsyncValue(): Promise<string> {
    // Wait for the previous request to finish, if any
    await lock.value
    // Lock the execution by replacing the lock promise with a new, unresolved promise.
    let unlock
    lock.value = new Promise(resolve => unlock = resolve)

    if (captchaUuid.value)
      return captchaUuid.value

    try {
      if (!token.value)
        await getCaptchaToken()
      captchaUuid.value = await authenticateAnonUser(DATABASE_ARGS, token.value!)
      return captchaUuid.value
    }
    catch (error: any) {
      if ('message' in error && error.message.includes('Invalid Captcha UUID')) {
        globalThis.localStorage.removeItem('cryptomap__captcha_token_uuid')
        token.value = undefined
        console.error('Invalid captcha token, retrying...', error)
        return await getAsyncValue()
      }
      throw error
    }
    finally {
      // Release the lock for subsequent operations and reset the lock state.
      unlock!()
    }
  }

  const { payload: captchaTokenUuid, init } = useExpiringStorage('captcha_token_uuid', { expiresIn: CAPTCHA_TOKEN_VALIDITY, getAsyncValue })

  // const loadRecaptcha = () => {
  //   if (loaded)
  //     return
  //   const script = document.createElement('script')

  //   script.src = `https://www.google.com/recaptcha/api.js?render=${recapthaKey}`
  //   script.id = 'recaptcha-script'
  //   script.async = true

  //   document.body.append(script)
  //   script.onload = () => loaded = true
  // }

  // const removeRecaptcha = () => {
  //   const script = document.getElementById('recaptcha-script')
  //   if (script)
  //     script.remove()

  //   const recaptchaElems = document.getElementsByClassName('grecaptcha-badge')
  //   if (recaptchaElems.length)
  //     recaptchaElems[0].remove()
  // }

  return {
    getCaptchaToken,
    captchaTokenUuid,
    init,
  }
}

export const useCaptcha = createSharedComposable(_useCaptcha)
