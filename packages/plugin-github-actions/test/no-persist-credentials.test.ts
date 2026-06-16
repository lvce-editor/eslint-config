import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/no-persist-credentials.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('noPersistCredentials', rule, {
  valid: [
    {
      code: `
jobs:
  ci:
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false`,
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
          messageId: 'missingPersistCredentials',
        },
      ],
    },
    {
      code: `
jobs:
  ci:
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: true`,
      errors: [
        {
          messageId: 'unsupportedPersistCredentials',
        },
      ],
    },
  ],
})
