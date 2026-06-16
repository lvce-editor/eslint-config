import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/no-duplicate-workflow-names.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('noDuplicateWorkflowNames', rule, {
  valid: [
    {
      code: `
name: CI
jobs:
  ci:
    steps:
      - run: npm test`,
      filename: '/repo/.github/workflows/ci.yml',
    },
    {
      code: `
name: Release
jobs:
  release:
    steps:
      - run: npm publish`,
      filename: '/repo/.github/workflows/release.yml',
    },
  ],
  invalid: [
    {
      code: `
name: CI
jobs:
  ci:
    steps:
      - run: npm test`,
      filename: '/repo/.github/workflows/duplicate-ci.yml',
      errors: [
        {
          messageId: 'duplicateWorkflowName',
        },
      ],
    },
  ],
})
