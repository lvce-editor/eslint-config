import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/npm.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('npm', rule, {
  invalid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    steps:
      - run: npm abc`,
      errors: [
        {
          column: 14,
          endColumn: 21,
          endLine: 6,
          line: 6,
          messageId: 'unsupportedNpmCommand',
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
    steps:
      - run: npm run dev`,
    },
  ],
})
