import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'

export const VerifyCaptcha = DefineFunction({
  callback_id: 'verify_captcha',
  title: 'Verify captcha',
  description: 'Verify the captcha token with Google\'s API.',
  source_file: 'functions/verify_captcha.ts',
  input_parameters: {
    properties: {
      captcha: {
        type: Schema.types.string,
        description: 'The token created in the client-side',
      },
    },
    required: ['captcha'],
  },
  output_parameters: {
    properties: {
      success: {
        type: Schema.types.boolean,
      },
    },
    required: ['success'],
  },
})

export default SlackFunction(
  VerifyCaptcha,
  async ({ inputs, env }) => {
    const googleCaptchaSecret = env.GOOGLE_CAPTCHA_KEY

    try {
      const url = 'https://www.google.com/recaptcha/api/siteverify'

      const data = new URLSearchParams()
      data.append('secret', googleCaptchaSecret)
      data.append('response', inputs.captcha)

      // We could use `remoteip` as well, it is optional. Should be user's IP, not server's!

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      })

      const result = await response.json()

      if (!result.success) {
        return {
          error: 'Captcha verification failed',
        }
      }

      return {
        outputs: {
          success: true,
        },
      }
    }
    catch (error) {
      console.error(error)
      return {
        error: `Error: ${error}`,
      }
    }
  },
)
