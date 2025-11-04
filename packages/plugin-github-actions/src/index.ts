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
    name: 'github-actions/recommended',
    plugins: {
      'github-actions': plugin,
    },
    files: ['**/.github/workflows/*.y?(a)ml'],
    languageOptions: {
      parser: parserYAML,
    },
  },
]

export default recommended
