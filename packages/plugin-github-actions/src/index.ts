import type { Linter } from 'eslint'
import * as parserYAML from 'yaml-eslint-parser'
import * as actionVersions from './action-versions.ts'
import * as ciVersions from './ci-versions.ts'
import * as failFast from './fail-fast.ts'
import * as maxParallel from './max-parallel.ts'
import * as npmRegistry from './npm-registry.ts'
import * as on from './on.ts'
import * as timeoutMinutes from './timeout-minutes.ts'
import * as shell from './shell.ts'
import * as npm from './npm.ts'
import * as matrix from './matrix.ts'

const plugin = {
  meta: {
    name: 'github-actions',
    version: '0.0.1',
  },
  rules: {
    'action-versions': actionVersions,
    'ci-versions': ciVersions,
    'fail-fast': failFast,
    'max-parallel': maxParallel,
    'npm-registry': npmRegistry,
    'timeout-minutes': timeoutMinutes,
    matrix: matrix,
    npm: npm,
    on: on,
    shell,
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
      'github-actions/action-versions': 'error',
      'github-actions/ci-versions': 'error',
      'github-actions/fail-fast': 'error',
      'github-actions/matrix': 'off',
      'github-actions/max-parallel': 'error',
      'github-actions/npm-registry': 'error',
      'github-actions/npm': 'error',
      'github-actions/on': 'error',
      'github-actions/shell': 'error',
      'github-actions/timeout-minutes': 'error',
    },
  },
]

export default recommended
