import type { Linter } from 'eslint'
import * as hoistRegex from './rules/hoist-regex.ts'

const plugin = {
  meta: {
    name: 'regex',
    version: '0.0.1',
  },
  rules: {
    'hoist-regex': hoistRegex,
  },
  configs: {},
}

const recommended: Linter.Config[] = [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      regex: plugin,
    },
    rules: {
      'regex/hoist-regex': 'error',
    },
  },
]

export default recommended