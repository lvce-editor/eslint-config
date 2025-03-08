import json from '@eslint/json'
import * as tsconfigAllowImportingTsExtensions from './tsconfig-allow-importing-ts-extensions.ts'
import * as tsconfigForceConsistentCasingInFileNames from './tsconfig-force-consistent-casing-in-file-names.ts'
import * as tsconfigNoUncheckedSideEffectImports from './tsconfig-no-unchecked-side-effect-imports.ts'
import * as tsconfigNoImplicitAny from './tsconfig-no-implicit-any.ts'
import * as tsconfigStrict from './tsconfig-strict.ts'
import * as tsconfigAssumeChangesOnlyAffectDirectDependencies from './tsconfig-assume-changes-only-affect-direct-dependencies.ts'
import * as tsconfigExactOptionalPropertyTypes from './tsconfig-exact-optional-property-types.ts'
import * as tsconfigErasableSyntaxOnly from './tsconfig-erasable-syntax-only.ts'

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
    'no-implicit-any': tsconfigNoImplicitAny,
    'assume-changes-only-affect-direct-dependenices': tsconfigAssumeChangesOnlyAffectDirectDependencies,
    'exact-optional-property-types': tsconfigExactOptionalPropertyTypes,
    'erasable-syntax-only': tsconfigErasableSyntaxOnly,
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
      'tsconfig/erasable-syntax-only': 'error',
      'tsconfig/allow-importing-ts-extensions': 'error',
      'tsconfig/no-implicit-any': 'error',
      'tsconfig/assume-changes-only-affect-direct-dependenices': 'error',
      'tsconfig/exact-optional-property-types': 'error',
    },
  },
]

export default recommended
