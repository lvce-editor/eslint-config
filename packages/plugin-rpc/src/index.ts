import type { Linter } from 'eslint'
import * as hoistRegex from './rules/hoist-regex.ts'
import * as preferUsingMockRpc from './rules/prefer-using-mock-rpc.ts'

const plugin = {
  meta: {
    name: 'rpc',
    version: '0.0.1',
  },
  rules: {
    'hoist-regex': hoistRegex,
    'prefer-using-mock-rpc': preferUsingMockRpc,
  },
  configs: {},
}

const recommended: Linter.Config[] = [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      rpc: plugin,
    },
    rules: {
      'rpc/hoist-regex': 'error',
      'rpc/prefer-using-mock-rpc': 'error',
    },
  },
]

export default recommended
