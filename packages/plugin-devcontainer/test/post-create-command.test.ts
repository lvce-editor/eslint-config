/* eslint sonarjs/no-empty-test-file: off */
import json from '@eslint/json'
import { RuleTester } from 'eslint'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as rule from '../src/rules/post-create-command.ts'

const createWorkspace = (packageJson: any): string => {
  const workspace = mkdtempSync(join(tmpdir(), 'devcontainer-rule-'))
  mkdirSync(join(workspace, 'packages', 'e2e'), { recursive: true })
  writeFileSync(join(workspace, 'packages', 'e2e', 'package.json'), JSON.stringify(packageJson, null, 2))
  return workspace
}

const noE2eWorkspace = mkdtempSync(join(tmpdir(), 'devcontainer-rule-'))
const noPlaywrightWorkspace = createWorkspace({
  dependencies: {
    typescript: '^6.0.0',
  },
})
const validPlaywrightWorkspace = createWorkspace({
  devDependencies: {
    '@playwright/test': '^1.0.0',
  },
  scripts: {
    postinstall: 'npx playwright install-deps && npx playwright install',
  },
})
const invalidPlaywrightWorkspace = createWorkspace({
  devDependencies: {
    '@playwright/test': '^1.0.0',
  },
})

const originalCwd = process.cwd()

const createRuleTester = (cwd: string): RuleTester => {
  process.chdir(cwd)
  return new RuleTester({
    language: 'json/json',
    plugins: {
      // @ts-ignore
      json,
    },
  })
}

const validPlaywrightRuleTester = createRuleTester(validPlaywrightWorkspace)

validPlaywrightRuleTester.run('post-create-command-valid-playwright', rule, {
  invalid: [],
  valid: [
    {
      code: '{"postCreateCommand": "npm ci"}',
    },
  ],
})
process.chdir(originalCwd)

const noE2eRuleTester = createRuleTester(noE2eWorkspace)

noE2eRuleTester.run('post-create-command-no-e2e', rule, {
  invalid: [
    {
      code: '{}',
      errors: [
        {
          messageId: 'missingPostCreateCommand',
        },
      ],
    },
    {
      code: '{"postCreateCommand": 1}',
      errors: [
        {
          messageId: 'postCreateCommandMustBeString',
        },
      ],
    },
    {
      code: '{"postCreateCommand": "npm ci && cd packages/e2e && npx playwright install-deps && npx playwright install"}',
      errors: [
        {
          messageId: 'invalidPostCreateCommand',
        },
      ],
    },
  ],
  valid: [
    {
      code: '{"postCreateCommand": "npm ci"}',
    },
  ],
})
process.chdir(originalCwd)

const noPlaywrightRuleTester = createRuleTester(noPlaywrightWorkspace)

noPlaywrightRuleTester.run('post-create-command-no-playwright', rule, {
  invalid: [],
  valid: [
    {
      code: '{"postCreateCommand": "npm ci"}',
    },
  ],
})
process.chdir(originalCwd)

const invalidPlaywrightRuleTester = createRuleTester(invalidPlaywrightWorkspace)

invalidPlaywrightRuleTester.run('post-create-command-invalid-playwright', rule, {
  invalid: [
    {
      code: '{"postCreateCommand": "npm ci"}',
      errors: [
        {
          messageId: 'missingPlaywrightPostinstall',
        },
      ],
    },
  ],
  valid: [],
})
process.chdir(originalCwd)

rmSync(noE2eWorkspace, { force: true, recursive: true })
rmSync(noPlaywrightWorkspace, { force: true, recursive: true })
rmSync(validPlaywrightWorkspace, { force: true, recursive: true })
rmSync(invalidPlaywrightWorkspace, { force: true, recursive: true })
