import type { Linter } from 'eslint'
import json from '@eslint/json'
import * as tsconfigAllowImportingTsExtensions from './tsconfig-allow-importing-ts-extensions.ts'
import * as tsconfigAssumeChangesOnlyAffectDirectDependencies from './tsconfig-assume-changes-only-affect-direct-dependencies.ts'
import * as tsconfigDontSkipLibCheck from './tsconfig-dont-skip-libcheck.ts'
import * as tsconfigErasableSyntaxOnly from './tsconfig-erasable-syntax-only.ts'
import * as tsconfigExactOptionalPropertyTypes from './tsconfig-exact-optional-property-types.ts'
import * as tsconfigForceConsistentCasingInFileNames from './tsconfig-force-consistent-casing-in-file-names.ts'
import * as tsconfigModuleResolution from './tsconfig-module-resolution.ts'
import * as tsconfigNoImplicitAny from './tsconfig-no-implicit-any.ts'
import * as tsconfigNoUncheckedSideEffectImports from './tsconfig-no-unchecked-side-effect-imports.ts'
import * as tsconfigStrict from './tsconfig-strict.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'tsconfig',
    version: '0.0.1',
  },
  rules: {
    'allow-importing-ts-extensions': tsconfigAllowImportingTsExtensions,
    'assume-changes-only-affect-direct-dependenices': tsconfigAssumeChangesOnlyAffectDirectDependencies,
    'dont-skip-lib-check': tsconfigDontSkipLibCheck,
    'erasable-syntax-only': tsconfigErasableSyntaxOnly,
    'exact-optional-property-types': tsconfigExactOptionalPropertyTypes,
    'force-consistent-casing-in-file-names': tsconfigForceConsistentCasingInFileNames,
    'module-resolution': tsconfigModuleResolution,
    'no-implicit-any': tsconfigNoImplicitAny,
    'no-unchecked-side-effect-imports': tsconfigNoUncheckedSideEffectImports,
    strict: tsconfigStrict,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/tsconfig.json'],
    language: 'json/jsonc',
    languageOptions: {
      allowTrailingCommas: true,
    },
    plugins: {
      // @ts-ignore
      json,
      tsconfig: plugin,
    },
    rules: {
      'tsconfig/allow-importing-ts-extensions': 'error',
      'tsconfig/assume-changes-only-affect-direct-dependenices': 'error',
      'tsconfig/dont-skip-lib-check': 'error',
      'tsconfig/erasable-syntax-only': 'off',
      'tsconfig/exact-optional-property-types': 'error',
      'tsconfig/force-consistent-casing-in-file-names': 'error',
      'tsconfig/module-resolution': 'error',
      'tsconfig/no-implicit-any': 'error',
      'tsconfig/no-unchecked-side-effect-imports': 'error',
      'tsconfig/strict': 'error',
    },
  },
]

export default recommended
