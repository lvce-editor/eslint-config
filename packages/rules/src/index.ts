import json from '@eslint/json'
import * as tsconfigAllowImportingTsExtensions from './tsconfig-allow-importing-ts-extensions.ts'
import * as tsconfigForceConsistentCasingInFileNames from './tsconfig-force-consistent-casing-in-file-names.ts'
import * as tsconfigNoUncheckedSideEffectImports from './tsconfig-no-unchecked-side-effect-imports.ts'
import * as tsconfigStrict from './tsconfig-strict.ts'

const plugin = {
  meta: {
    name: 'tsconfig',
    version: '0.0.1',
  },
  rules: {
    'no-unchecked-side-effect-imports': tsconfigNoUncheckedSideEffectImports,
    'force-consistent-casing-in-file-names': tsconfigForceConsistentCasingInFileNames,
    strict: tsconfigStrict,
    'allow-importing-ts-extensions': tsconfigAllowImportingTsExtensions,
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
      'tsconfig/strict': 'error',
      'tsconfig/allow-importing-ts-extensions': 'error',
    },
  },
]

export default recommended
