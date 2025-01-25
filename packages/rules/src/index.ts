import * as tsconfigNoUncheckedSideEffectImports from './tsconfig-no-unchecked-side-effect-imports.ts'
import * as tsconfigForceConsistentCasingInFileNames from './tsconfig-force-consistent-casing-in-file-names.ts'
import json from '@eslint/json'

const plugin = {
  meta: {
    name: 'tsconfig',
    version: '0.0.1',
  },
  rules: {
    'no-unchecked-side-effect-imports': tsconfigNoUncheckedSideEffectImports,
    'force-consistent-casing-in-file-names': tsconfigForceConsistentCasingInFileNames,
  },
  configs: {},
}

const recommended = [
  {
    plugins: {
      json,
    },
  },
  {
    files: ['**/*.json'],
    language: 'json/json',
    rules: {},
  },
  {
    plugins: {
      tsconfig: plugin,
    },
  },
  {
    rules: {
      'tsconfig/no-unchecked-side-effect-imports': 'error',
      'tsconfig/force-consistent-casing-in-file-names': 'error',
    },
  },
]

export default recommended
