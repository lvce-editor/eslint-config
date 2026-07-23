import type { Linter } from 'eslint'
import json from '@eslint/json'
import * as contentSecurityPolicy from './rules/content-security-policy.ts'
import * as validKeybindings from './rules/valid-keybindings.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'extension-json',
    version: '0.0.1',
  },
  rules: {
    'content-security-policy': contentSecurityPolicy,
    'valid-keybindings': validKeybindings,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/extension.json'],
    language: 'json/json',
    plugins: {
      'extension-json': plugin,
      // @ts-ignore
      json,
    },
    rules: {
      'extension-json/content-security-policy': 'error',
      'extension-json/valid-keybindings': 'error',
    },
  },
]

export default recommended
