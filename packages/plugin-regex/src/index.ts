import type { Linter } from 'eslint'
import * as hoistRegex from './rules/hoist-regex.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'regex',
    version: '0.0.1',
  },
  rules: {
    'hoist-regex': hoistRegex,
  },
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
