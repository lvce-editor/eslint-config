import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/on.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('on', rule, {
  invalid: [
    {
      code: `
on:
  abc:`,
      errors: [
        {
          column: 1,
          endColumn: 7,
          endLine: 3,
          line: 2,
          messageId: 'unsupportedOn',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
on:
  push:
  pull_request:
    branches:
      - main`,
    },
  ],
})
