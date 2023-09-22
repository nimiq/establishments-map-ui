const recapthaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

export function useCaptcha() {
  let loaded = false

  async function getToken(): Promise<string> {
    // TODO: Add grecaptcha.ready() to prevent race condition
    return await grecaptcha.execute(recapthaKey, { action: 'submit' })
  }

  const loadRecaptcha = () => {
    if (loaded)
      return
    const script = document.createElement('script')

    script.src = `https://www.google.com/recaptcha/api.js?render=${recapthaKey}`
    script.id = 'recaptcha-script'
    script.async = true

    document.body.append(script)
    script.onload = () => loaded = true
  }

  const removeRecaptcha = () => {
    const script = document.getElementById('recaptcha-script')
    if (script)
      script.remove()

    const recaptchaElems = document.getElementsByClassName('grecaptcha-badge')
    if (recaptchaElems.length)
      recaptchaElems[0].remove()
  }

  return {
    getToken,
    loadRecaptcha,
    removeRecaptcha,
  }
}
