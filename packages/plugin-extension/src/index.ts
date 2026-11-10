import type { Linter } from 'eslint'
import * as noEmptyOptionalProviderMethod from './rules/no-empty-optional-provider-method.ts'

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

export default recommended
