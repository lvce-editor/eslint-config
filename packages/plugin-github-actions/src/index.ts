import type { Linter } from 'eslint'
import * as parserYAML from 'yaml-eslint-parser'
import * as actionVersions from './action-versions.ts'
import * as ciVersions from './ci-versions.ts'
import * as failFast from './fail-fast.ts'
import * as maxParallel from './max-parallel.ts'
import * as npmRegistry from './npm-registry.ts'
import * as timeoutMinutes from './timeout-minutes.ts'

const plugin = {
  meta: {
    name: 'github-actions',
    version: '0.0.1',
  },
  rules: {
    'action-versions': actionVersions,
    'ci-versions': ciVersions,
    'max-parallel': maxParallel,
    'npm-registry': npmRegistry,
    'fail-fast': failFast,
    'timeout-minutes': timeoutMinutes,
  },
}

const recommended: Linter.Config[] = [
  {
    plugins: {
      'github-actions': plugin,
    },
    files: ['**/.github/workflows/*.y?(a)ml'],
    languageOptions: {
      parser: parserYAML,
    },
    rules: {
      'github-actions/ci-versions': 'error',
      'github-actions/action-versions': 'error',
      'github-actions/timeout-minutes': 'error',
      'github-actions/max-parallel': 'error',
      'github-actions/npm-registry': 'error',
    },
  },
]

export default recommended
