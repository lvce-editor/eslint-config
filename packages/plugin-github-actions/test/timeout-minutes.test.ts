import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/timeout-minutes.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('timeoutMinutes', rule, {
  valid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    timeout-minutes: 30`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    timeout-minutes: test`,
      errors: [
        {
          messageId: 'unsupportedTimeoutMinutes',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 26,
        },
      ],
    },
  ],
})
