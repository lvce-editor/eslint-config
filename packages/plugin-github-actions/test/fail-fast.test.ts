import { RuleTester } from 'eslint'
import { parseYAML } from 'yaml-eslint-parser'
import * as rule from '../src/rules/fail-fast.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parseYAML,
    ecmaVersion: 2020,
  },
})

ruleTester.run('failFast', rule, {
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
          column: 16,
          endLine: 5,
          endColumn: 20,
        },
      ],
    },
  ],
})
