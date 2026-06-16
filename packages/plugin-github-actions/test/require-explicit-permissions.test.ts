import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/require-explicit-permissions.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('requireExplicitPermissions', rule, {
  valid: [
    {
      code: `
permissions: {}
jobs:
  ci:
    steps:
      - run: npm test`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  ci:
    steps:
      - run: npm test`,
      errors: [
        {
          messageId: 'missingPermissions',
        },
      ],
    },
  ],
})
