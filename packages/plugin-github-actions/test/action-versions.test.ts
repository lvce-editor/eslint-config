import { RuleTester } from 'eslint'
import { parseYAML } from 'yaml-eslint-parser'
import * as rule from '../src/rules/action-versions.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: { parse: parseYAML },
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
      - uses: actions/checkout@v6`,
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
      output: `
jobs:
  ci:
    strategy:
      matrix:
        os: [ubuntu-24.04]
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v6`,
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
