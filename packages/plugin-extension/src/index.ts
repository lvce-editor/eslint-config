import type { Linter } from 'eslint'
import json from '@eslint/json'
import * as contentSecurityPolicy from './rules/content-security-policy.ts'
import * as noEmptyOptionalProviderMethod from './rules/no-empty-optional-provider-method.ts'
import * as nonEmptyLanguages from './rules/non-empty-languages.ts'
import * as validConfiguration from './rules/valid-configuration.ts'
import * as validKeybindings from './rules/valid-keybindings.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'extension',
    version: '0.0.1',
  },
  rules: {
    'no-empty-optional-provider-method': noEmptyOptionalProviderMethod,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/*.{ts,mts,cts}'],
    plugins: {
      extension: plugin,
    },
    rules: {
      'extension/no-empty-optional-provider-method': 'error',
    },
  },
]

const manifestPlugin = {
  configs: {},
  meta: {
    name: 'extension-json',
    version: '0.0.1',
  },
  rules: {
    'content-security-policy': contentSecurityPolicy,
    'non-empty-languages': nonEmptyLanguages,
    'valid-configuration': validConfiguration,
    'valid-keybindings': validKeybindings,
  },
}

export const recommendedExtensionJson: Linter.Config[] = [
  {
    files: ['**/extension.json'],
    language: 'json/json',
    plugins: {
      'extension-json': manifestPlugin,
      // @ts-ignore
      json,
    },
    rules: {
      'extension-json/content-security-policy': 'error',
      'extension-json/non-empty-languages': 'error',
      'extension-json/valid-configuration': 'error',
      'extension-json/valid-keybindings': 'error',
    },
  },
]

export default recommended
