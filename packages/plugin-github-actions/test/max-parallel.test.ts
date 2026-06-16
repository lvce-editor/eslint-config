import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/max-parallel.ts'

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
    max-parallel: test`,
      errors: [
        {
          column: 5,
          endColumn: 26,
          endLine: 5,
          line: 5,
          messageId: 'unsupportedMaxParallel',
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
    max-parallel: 1`,
    },
  ],
})
