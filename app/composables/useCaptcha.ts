import { authenticateAnonUser } from 'database'
import { createSharedComposable } from '@vueuse/core'
import { useRecaptchaProvider } from 'vue-recaptcha'

const CAPTCHA_TOKEN_VALIDITY = 10 * 60 * 1000 // 10 minutes for the captcha token

function _useCaptcha() {
  const token = ref<string>()
  const captchaUuid = ref<string>()
  const lock = ref(Promise.resolve()) // Lock to prevent multiple requests

  async function getCaptchaToken() {
    useRecaptchaProvider()
    token.value = await useChallengeV3('idle').execute()

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
    if(!import.meta.client)
      return ''

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
      const { databaseKey, databaseUrl } = useRuntimeConfig().public
      captchaUuid.value = await authenticateAnonUser({ url: databaseUrl, apikey: databaseKey}, token.value!)
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

  const captchaTokenUuid = useCookie('captcha_token_uuid', { default: getAsyncValue, expires: new Date(Date.now() + CAPTCHA_TOKEN_VALIDITY) })

  return {
    getCaptchaToken,
    captchaTokenUuid,
  }
}

export const useCaptcha = createSharedComposable(_useCaptcha)
