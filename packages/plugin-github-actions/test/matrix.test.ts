import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/matrix.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('matrix', rule, {
  invalid: [
    {
      code: `
jobs:
  pr:
    matrix: abc
`,
      errors: [
        {
          column: 5,
          endColumn: 16,
          endLine: 4,
          line: 4,
          messageId: 'unsupportedMatrix',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
jobs:
  pr:
    matrix: [ubuntu-24.04]`,
    },
  ],
})
