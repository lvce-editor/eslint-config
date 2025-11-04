import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/max-parallel.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('maxParallel', rule, {
  valid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    max-parallel: 1`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    max-parallel: test`,
      errors: [
        {
          messageId: 'unsupportedMaxParallel',
          line: 5,
          column: 5,
          endLine: 5,
          endColumn: 26,
        },
      ],
    },
  ],
})
