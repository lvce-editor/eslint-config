import type { Linter } from 'eslint'
import * as parserYAML from 'yaml-eslint-parser'
import * as actionVersions from './action-versions.ts'
import * as ciVersions from './ci-versions.ts'

const plugin = {
  meta: {
    name: 'github-actions',
    version: '0.0.1',
  },
  rules: {
    'ci-versions': ciVersions,
    'action-versions': actionVersions,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/.github/workflows/*.y?(a)ml'],
    languageOptions: {
      parser: parserYAML,
    },
  },
  {
    plugins: {
      'github-actions': plugin,
    },
  },

  {
    rules: {
      'github-actions/ci-versions': 'error',
      'github-actions/action-versions': 'error',
    },
  },
]

export default recommended
