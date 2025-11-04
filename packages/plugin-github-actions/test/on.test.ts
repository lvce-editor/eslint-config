import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/on.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('on', rule, {
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
  invalid: [
    {
      code: `
on:
  abc:`,
      errors: [
        {
          messageId: 'unsupportedOn',
          column: 1,
          endColumn: 7,
          endLine: 3,
          line: 2,
        },
      ],
    },
  ],
})
