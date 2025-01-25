import * as tsconfigNoUncheckedSideEffectImports from './tsconfig-no-unchecked-side-effect-imports.ts'
import json from '@eslint/json'

const plugin = {
  meta: {
    name: 'tsconfig',
    // version: '0.0.1', // x-release-please-version
  },
  files: ['**/tsconfig.json'],
  languages: {
    ...json.languages,
  },
  rules: {
    'no-unchecked-side-effect-imports': tsconfigNoUncheckedSideEffectImports,
  },
  configs: {},
}

const recommended = {
  plugins: {
    tsconfig: plugin,
  },
  rules: /** @type {const} */ {
    'tsconfig/no-unchecked-side-effect-imports': 'error',
  },
}

export default recommended
