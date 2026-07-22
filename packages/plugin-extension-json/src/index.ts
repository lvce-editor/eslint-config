import type { Linter } from 'eslint'
import json from '@eslint/json'
import * as contentSecurityPolicy from './rules/content-security-policy.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'extension-json',
    version: '0.0.1',
  },
  rules: {
    'content-security-policy': contentSecurityPolicy,
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
    },
  },
]

export default recommended
