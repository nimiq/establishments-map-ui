import { authenticateAnonUser } from 'database'
import { createSharedComposable } from '@vueuse/core'
import { useExpiringStorage } from '@/composables/useExpiringStorage'
import { DATABASE_ARGS } from '@/shared'

const CAPTCHA_TOKEN_VALIDITY = 10 * 60 * 1000 // 10 minutes for the captcha token
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

async function _useCaptcha() {
  async function getCaptchaToken() {
    while (!globalThis.grecaptcha)
      await new Promise(resolve => setTimeout(resolve, 100))
    return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'idle' })
  }

  const { payload: captchaToken, init } = useExpiringStorage('captcha_token_uuid', { expiresIn: CAPTCHA_TOKEN_VALIDITY, getAsyncValue: async () => authenticateAnonUser(DATABASE_ARGS, await getCaptchaToken()) })
  await init()

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
    captchaToken,
  }
}

export const useCaptcha = createSharedComposable(_useCaptcha)
