import type { Linter } from 'eslint'
import * as noRendererWorkerDestructuring from './rules/no-renderer-worker-destructuring.ts'
import * as preferUsingMockRpc from './rules/prefer-using-mock-rpc.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'rpc',
    version: '0.0.1',
  },
  rules: {
    'no-renderer-worker-destructuring': noRendererWorkerDestructuring,
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
      'rpc/no-renderer-worker-destructuring': 'error',
      'rpc/prefer-using-mock-rpc': 'error',
    },
  },
]

export default recommended
