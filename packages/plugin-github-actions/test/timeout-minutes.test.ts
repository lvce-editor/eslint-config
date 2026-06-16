import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/timeout-minutes.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('timeoutMinutes', rule, {
  invalid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    timeout-minutes: test`,
      errors: [
        {
          column: 22,
          endColumn: 26,
          endLine: 5,
          line: 5,
          messageId: 'unsupportedTimeoutMinutes',
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
    timeout-minutes: 30`,
    },
  ],
})
