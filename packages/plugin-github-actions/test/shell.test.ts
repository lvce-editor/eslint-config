import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/shell.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('maxParallel', rule, {
  invalid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    shell: abc`,
      errors: [
        {
          column: 5,
          endColumn: 15,
          endLine: 5,
          line: 5,
          messageId: 'unsupportedShell',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    shell: bash`,
    },
  ],
})
