import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/fail-fast.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('maxParallel', rule, {
  valid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    fail-fast: true`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    fail-fast: test`,
      errors: [
        {
          messageId: 'unsupportedFailFast',
          line: 5,
          column: 5,
          endLine: 5,
          endColumn: 20,
        },
      ],
    },
  ],
})
