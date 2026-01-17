import { RuleTester } from 'eslint'
import { parseYAML } from 'yaml-eslint-parser'
import * as rule from '../src/rules/npm.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parseYAML,
    ecmaVersion: 2020,
  },
})

ruleTester.run('npm', rule, {
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
          messageId: 'unsupportedNpmCommand',
          column: 14,
          endColumn: 21,
          endLine: 6,
          line: 6,
        },
      ],
    },
  ],
})
