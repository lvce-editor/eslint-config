import type { Linter } from 'eslint'
import * as preferMergeClassNames from './rules/prefer-merge-class-names.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'virtual-dom',
    version: '0.0.1',
  },
  rules: {
    'prefer-merge-class-names': preferMergeClassNames,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      'virtual-dom': plugin,
    },
    rules: {
      'virtual-dom/prefer-merge-class-names': 'error',
    },
  },
]

export default recommended
