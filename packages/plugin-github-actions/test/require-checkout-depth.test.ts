import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/require-checkout-depth.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('requireCheckoutDepth', rule, {
  valid: [
    {
      code: `
jobs:
  ci:
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  ci:
    steps:
      - uses: actions/checkout@v6`,
      errors: [
        {
          messageId: 'missingFetchDepth',
        },
      ],
    },
  ],
})
