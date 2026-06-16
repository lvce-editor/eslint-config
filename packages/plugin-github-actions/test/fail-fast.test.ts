import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/fail-fast.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('failFast', rule, {
  invalid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    fail-fast: test`,
      errors: [
        {
          column: 16,
          endColumn: 20,
          endLine: 5,
          line: 5,
          messageId: 'unsupportedFailFast',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    fail-fast: true`,
    },
  ],
})
