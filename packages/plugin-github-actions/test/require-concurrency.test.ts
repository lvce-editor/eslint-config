import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/require-concurrency.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('requireConcurrency', rule, {
  valid: [
    {
      code: `
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true
jobs:
  ci:
    steps:
      - run: npm test`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  ci:
    steps:
      - run: npm test`,
      errors: [
        {
          messageId: 'missingConcurrency',
        },
      ],
    },
    {
      code: `
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: false
jobs:
  ci:
    steps:
      - run: npm test`,
      errors: [
        {
          messageId: 'missingConcurrency',
        },
      ],
    },
  ],
})
