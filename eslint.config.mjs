import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(antfu({
  unocss: true,
  vue: true,
  ignores: ['types/supabase.ts'],
  rules: {
    'no-restricted-syntax': 'off',
  },
}))
