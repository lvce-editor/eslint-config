import { RuleTester } from 'eslint'
import { parseYAML } from 'yaml-eslint-parser'
import * as rule from '../src/rules/matrix.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parseYAML,
    ecmaVersion: 2020,
  },
})

ruleTester.run('matrix', rule, {
  valid: [
    {
      code: `
jobs:
  pr:
    matrix: [ubuntu-24.04]`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  pr:
    matrix: abc
`,
      errors: [
        {
          messageId: 'unsupportedMatrix',
          column: 5,
          endColumn: 16,
          endLine: 4,
          line: 4,
        },
      ],
    },
  ],
})
