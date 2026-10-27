import json from '@eslint/json'
import { RuleTester } from 'eslint'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as rule from '../src/rules/node-version.ts'

const workspace = mkdtempSync(join(tmpdir(), 'devcontainer-node-version-'))
const devcontainerDirectory = join(workspace, '.devcontainer')
mkdirSync(devcontainerDirectory)
const filename = join(devcontainerDirectory, 'devcontainer.json')
const otherDirectory = mkdtempSync(join(tmpdir(), 'devcontainer-node-version-cwd-'))
const originalCwd = process.cwd()
const writeNvmrc = (contents: string): void => writeFileSync(join(workspace, '.nvmrc'), contents)

const ruleTester = new RuleTester({
  language: 'json/jsonc',
  languageOptions: {
    allowTrailingCommas: true,
  },
  plugins: {
    // @ts-ignore
    json,
  },
})

writeNvmrc('26.12.1\n')
ruleTester.run('node-version', rule, {
  invalid: [
    {
      code: '{\n  // use current LTS\n  "image": "mcr.microsoft.com/devcontainers/javascript-node:24",\n}',
      errors: [{ line: 3, messageId: 'nodeMajorMismatch' }],
      filename,
    },
  ],
  valid: [
    {
      code: '{"image":"mcr.microsoft.com/devcontainers/javascript-node:26"}',
      filename,
    },
    {
      code: '{"image":"mcr.microsoft.com/devcontainers/javascript-node:26.1"}',
      filename,
    },
  ],
})

writeNvmrc(' v26.3.0 \n')
ruleTester.run('node-version-v-prefix', rule, {
  invalid: [],
  valid: [{ code: '{"image":"mcr.microsoft.com/devcontainers/javascript-node:26"}', filename }],
})

writeNvmrc('invalid')
ruleTester.run('node-version-invalid-nvmrc', rule, {
  invalid: [],
  valid: [{ code: '{"image":"mcr.microsoft.com/devcontainers/javascript-node:24"}', filename }],
})

rmSync(join(workspace, '.nvmrc'))
ruleTester.run('node-version-missing-nvmrc', rule, {
  invalid: [],
  valid: [{ code: '{"image":"mcr.microsoft.com/devcontainers/javascript-node:24"}', filename }],
})

writeNvmrc('26.12.1\n')
process.chdir(otherDirectory)
ruleTester.run('node-version-repository-resolution', rule, {
  invalid: [
    {
      code: '{"image":"mcr.microsoft.com/devcontainers/javascript-node:24"}',
      errors: [{ messageId: 'nodeMajorMismatch' }],
      filename,
    },
  ],
  valid: [],
})
process.chdir(originalCwd)
rmSync(workspace, { force: true, recursive: true })
rmSync(otherDirectory, { force: true, recursive: true })
