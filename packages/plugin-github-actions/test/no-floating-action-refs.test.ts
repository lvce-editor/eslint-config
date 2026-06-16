import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/no-floating-action-refs.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('noFloatingActionRefs', rule, {
  valid: [
    {
      code: `
jobs:
  ci:
    steps:
      - uses: actions/checkout@v6
      - uses: ./local-action
      - uses: docker://alpine:3.20`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  ci:
    steps:
      - uses: actions/checkout`,
      errors: [
        {
          messageId: 'missingActionRef',
        },
      ],
    },
    {
      code: `
jobs:
  ci:
    steps:
      - uses: actions/checkout@main`,
      errors: [
        {
          messageId: 'floatingActionRef',
        },
      ],
    },
  ],
})
