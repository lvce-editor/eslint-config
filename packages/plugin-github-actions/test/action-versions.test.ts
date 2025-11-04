import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/action-versions.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('unsupportedActionVersion', rule, {
  valid: [
    {
      code: `
jobs:
  ci:
    strategy:
      matrix:
        os: [ubuntu-24.04]
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v5`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  ci:
    strategy:
      matrix:
        os: [ubuntu-24.04]
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v1`,
      errors: [
        {
          messageId: 'unsupportedActionVersion',
          line: 9,
          column: 15,
          endLine: 9,
          endColumn: 34,
        },
      ],
    },
  ],
})
