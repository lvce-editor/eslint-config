import type { Linter } from 'eslint'
import * as preferUsingMockRpc from './rules/prefer-using-mock-rpc.ts'

const plugin = {
  meta: {
    name: 'rpc',
    version: '0.0.1',
  },
  rules: {
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
      'rpc/prefer-using-mock-rpc': 'error',
    },
  },
]

export default recommended
