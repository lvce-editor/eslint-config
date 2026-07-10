import type { Linter } from 'eslint'
import * as parserYAML from 'yaml-eslint-parser'
import * as actionVersions from './rules/action-versions.ts'
import * as ciVersions from './rules/ci-versions.ts'
import * as failFast from './rules/fail-fast.ts'
import * as githubPages from './rules/github-pages.ts'
import * as githubToken from './rules/github-token.ts'
import * as matrix from './rules/matrix.ts'
import * as maxParallel from './rules/max-parallel.ts'
import * as needs from './rules/needs.ts'
import * as noE2eInRelease from './rules/no-e2e-in-release.ts'
import * as noMeasureInRelease from './rules/no-measure-in-release.ts'
import * as nodeVersionFile from './rules/node-version-file.ts'
import * as npmRegistry from './rules/npm-registry.ts'
import * as npm from './rules/npm.ts'
import * as on from './rules/on.ts'
import * as permissions from './rules/permissions.ts'
import * as pythonVersion from './rules/python-version.ts'
import * as releaseAction from './rules/release-action.ts'
import * as shell from './rules/shell.ts'
import * as timeoutMinutes from './rules/timeout-minutes.ts'
import * as workingDirectory from './rules/working-directory.ts'

const plugin = {
  meta: {
    name: 'github-actions',
    version: '0.0.1',
  },
  rules: {
    'action-versions': actionVersions,
    'ci-versions': ciVersions,
    'fail-fast': failFast,
    'github-pages': githubPages,
    'github-token': githubToken,
    matrix: matrix,
    'max-parallel': maxParallel,
    needs: needs,
    'no-e2e-in-release': noE2eInRelease,
    'no-measure-in-release': noMeasureInRelease,
    'node-version-file': nodeVersionFile,
    npm: npm,
    'npm-registry': npmRegistry,
    on: on,
    permissions,
    'python-version': pythonVersion,
    'release-action': releaseAction,
    shell,
    'timeout-minutes': timeoutMinutes,
    'working-directory': workingDirectory,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/.github/workflows/*.y?(a)ml'],
    languageOptions: {
      parser: parserYAML,
    },
    plugins: {
      'github-actions': plugin,
    },
    rules: {
      'github-actions/action-versions': 'error',
      'github-actions/ci-versions': 'error',
      'github-actions/fail-fast': 'error',
      'github-actions/github-pages': 'error',
      'github-actions/github-token': 'error',
      'github-actions/matrix': 'off',
      'github-actions/max-parallel': 'error',
      'github-actions/needs': 'error',
      'github-actions/no-e2e-in-release': 'error',
      'github-actions/no-measure-in-release': 'error',
      'github-actions/node-version-file': 'error',
      'github-actions/npm': 'error',
      'github-actions/npm-registry': 'error',
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
