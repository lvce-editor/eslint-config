import * as tsconfigNoUncheckedSideEffectImports from './tsconfig-no-unchecked-side-effect-imports.ts'
import json from '@eslint/json'

const plugin = {
  meta: {
    name: '@lvce-editor/tsconfig',
    version: '0.0.1', // x-release-please-version
  },
  languages: {
    ...json.languages,
  },
  rules: {
    'tsconfig/no-unchecked-side-effect-imports': tsconfigNoUncheckedSideEffectImports,
  },
  configs: {
    recommended: {
      plugins: {},
      rules: /** @type {const} */ {
        'tsconfig/no-unchecked-side-effect-imports': 'error',
      },
    },
  },
}

export default plugin
