import type { Linter } from 'eslint'
import * as parserYAML from 'yaml-eslint-parser'
import * as actionVersions from './rules/action-versions.ts'
import * as ciVersions from './rules/ci-versions.ts'
import * as failFast from './rules/fail-fast.ts'
import * as githubToken from './rules/github-token.ts'
import * as matrix from './rules/matrix.ts'
import * as maxParallel from './rules/max-parallel.ts'
import * as needs from './rules/needs.ts'
import * as noCurlPipeShell from './rules/no-curl-pipe-shell.ts'
import * as noDuplicateWorkflowNames from './rules/no-duplicate-workflow-names.ts'
import * as noFloatingActionRefs from './rules/no-floating-action-refs.ts'
import * as noPersistCredentials from './rules/no-persist-credentials.ts'
import * as noSecretsInRunCommand from './rules/no-secrets-in-run-command.ts'
import * as noUntrustedContextInRun from './rules/no-untrusted-context-in-run.ts'
import * as noWriteAllPermissions from './rules/no-write-all-permissions.ts'
import * as nodeVersionFile from './rules/node-version-file.ts'
import * as npmRegistry from './rules/npm-registry.ts'
import * as npm from './rules/npm.ts'
import * as on from './rules/on.ts'
import * as permissions from './rules/permissions.ts'
import * as pythonVersion from './rules/python-version.ts'
import * as releaseAction from './rules/release-action.ts'
import * as requireCheckoutDepth from './rules/require-checkout-depth.ts'
import * as requireConcurrency from './rules/require-concurrency.ts'
import * as requireExplicitPermissions from './rules/require-explicit-permissions.ts'
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
    'github-token': githubToken,
    matrix: matrix,
    'max-parallel': maxParallel,
    'max-parallel': maxParallel,
    needs: needs,
    'no-curl-pipe-shell': noCurlPipeShell,
    'no-duplicate-workflow-names': noDuplicateWorkflowNames,
    'no-floating-action-refs': noFloatingActionRefs,
    'no-persist-credentials': noPersistCredentials,
    'no-secrets-in-run-command': noSecretsInRunCommand,
    'no-untrusted-context-in-run': noUntrustedContextInRun,
    'no-write-all-permissions': noWriteAllPermissions,
    'node-version-file': nodeVersionFile,
    'node-version-file': nodeVersionFile,
    npm: npm,
    'npm-registry': npmRegistry,
    'npm-registry': npmRegistry,
    on: on,
    permissions,
    'python-version': pythonVersion,
    'python-version': pythonVersion,
    'release-action': releaseAction,
    'release-action': releaseAction,
    'require-checkout-depth': requireCheckoutDepth,
    'require-concurrency': requireConcurrency,
    'require-explicit-permissions': requireExplicitPermissions,
    shell,
    'timeout-minutes': timeoutMinutes,
    'timeout-minutes': timeoutMinutes,
    'working-directory': workingDirectory,
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
      'github-actions/github-token': 'error',
      'github-actions/matrix': 'off',
      'github-actions/max-parallel': 'error',
      'github-actions/needs': 'error',
      'github-actions/no-curl-pipe-shell': 'error',
      'github-actions/no-duplicate-workflow-names': 'error',
      'github-actions/no-floating-action-refs': 'error',
      'github-actions/no-persist-credentials': 'error',
      'github-actions/no-secrets-in-run-command': 'error',
      'github-actions/no-untrusted-context-in-run': 'error',
      'github-actions/no-write-all-permissions': 'error',
      'github-actions/node-version-file': 'error',
      'github-actions/npm': 'error',
      'github-actions/npm-registry': 'error',
      'github-actions/npm-registry': 'error',
      'github-actions/on': 'error',
      'github-actions/permissions': 'off',
      'github-actions/python-version': 'error',
      'github-actions/release-action': 'error',
      'github-actions/require-checkout-depth': 'error',
      'github-actions/require-concurrency': 'error',
      'github-actions/require-explicit-permissions': 'error',
      'github-actions/shell': 'error',
      'github-actions/timeout-minutes': 'error',
      'github-actions/working-directory': 'error',
    },
  },
]

export default recommended
