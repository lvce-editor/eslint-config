import type { Linter } from 'eslint'
import * as noRpcRegistryDestructuring from './rules/no-rpc-registry-destructuring.ts'
import * as preferUsingMockRpc from './rules/prefer-using-mock-rpc.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'rpc',
    version: '0.0.1',
  },
  rules: {
    'no-renderer-worker-destructuring': noRpcRegistryDestructuring,
    'no-rpc-registry-destructuring': noRpcRegistryDestructuring,
    'prefer-using-mock-rpc': preferUsingMockRpc,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      rpc: plugin,
    },
    rules: {
      'rpc/no-rpc-registry-destructuring': 'error',
      'rpc/prefer-using-mock-rpc': 'error',
    },
  },
]

export default recommended
