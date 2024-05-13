import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  unocss: true,
  files: ['**/*.ts', '**/*.vue', '**/*.js', '**/*.json'],
  rules: {
    'ts/no-redeclare': 'off', // We auto-import the enums as types. Some times we need to re-import them as values

  },
  overrides: [
    {
      files: ['tsconfig.json'],
      rules: {
        'jsonc/sort-keys': 'off',
      },
    },
  ],
  ignorePatterns: ['**/dist/**/*', '**/*.config.{ts,js}', '**/*.po', '**/assets/**/*']
}, {
  files: ['**/*.d.ts'],
  rules: {
    'unused-imports/no-unused-imports': 'off',
    'ts/no-unsafe-declaration-merging': 'off'
  }
}, {
  files: ['env.d.ts', '*.config.ts', 'package.json', 'tsconfig.json', '**/*.vue', '**/*.ts'],
  rules: {
    // For some reason, the error shown in the console does not provide the correct line number, so I am not sure where
    // the error is. I will disable this rule for now.
    // Once someone fixes this https://github.com/eslint-community/eslint-plugin-security/issues/144
    'ts/no-use-before-define': 'off',
    'ts/newline-after-import': 'off',
    'import/newline-after-import': 'off',
    'import/no-mutable-exports': 'off',
    'ts/no-unsafe-declaration-merging': 'off',
  }
})
