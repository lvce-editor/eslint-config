import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/action-versions.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('unsupportedActionVersion', rule, {
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
          column: 15,
          endColumn: 34,
          endLine: 9,
          line: 9,
          messageId: 'unsupportedActionVersion',
        },
      ],
      output: `
jobs:
  ci:
    strategy:
      matrix:
        os: [ubuntu-24.04]
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v7`,
    },
  ],
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
      - uses: actions/checkout@v7`,
    },
  ],
})
