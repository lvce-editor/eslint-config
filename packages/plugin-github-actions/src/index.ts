import type { Linter } from 'eslint'
import * as parserYAML from 'yaml-eslint-parser'
import * as actionVersions from './rules/action-versions.ts'
import * as ciVersions from './rules/ci-versions.ts'
import * as failFast from './rules/fail-fast.ts'
import * as matrix from './rules/matrix.ts'
import * as maxParallel from './rules/max-parallel.ts'
import * as needs from './rules/needs.ts'
import * as nodeVersionFile from './rules/node-version-file.ts'
import * as npmRegistry from './rules/npm-registry.ts'
import * as npm from './rules/npm.ts'
import * as on from './rules/on.ts'
import * as permissions from './rules/permissions.ts'
import * as pythonVersion from './rules/python-version.ts'
import * as shell from './rules/shell.ts'
import * as timeoutMinutes from './rules/timeout-minutes.ts'
import * as workingDirectory from './rules/working-directory.ts'
import * as githubToken from './rules/github-token.ts'
import * as releaseAction from './rules/release-action.ts'

const plugin = {
  meta: {
    name: 'github-actions',
    version: '0.0.1',
  },
  rules: {
    'action-versions': actionVersions,
    'ci-versions': ciVersions,
    'fail-fast': failFast,
    'github-token': githubToken,
    'max-parallel': maxParallel,
    'node-version-file': nodeVersionFile,
    'npm-registry': npmRegistry,
    'python-version': pythonVersion,
    'release-action': releaseAction,
    'timeout-minutes': timeoutMinutes,
    'working-directory': workingDirectory,
    matrix: matrix,
    needs: needs,
    npm: npm,
    on: on,
    permissions,
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
      'github-actions/github-token': 'error',
      'github-actions/matrix': 'off',
      'github-actions/max-parallel': 'error',
      'github-actions/needs': 'error',
      'github-actions/node-version-file': 'error',
      'github-actions/npm-registry': 'error',
      'github-actions/npm': 'error',
      'github-actions/on': 'error',
      'github-actions/permissions': 'off',
      'github-actions/python-version': 'error',
      'github-actions/release-action': 'error',
      'github-actions/shell': 'error',
      'github-actions/timeout-minutes': 'error',
      'github-actions/working-directory': 'error',
    },
  },
]

export default recommended
