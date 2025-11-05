import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/needs.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('needs', rule, {
  valid: [
    {
      code: `
jobs:
  a:
    runs-on: ubuntu-24.04
    fail-fast: true

  b:
    needs: ["a"]`,
    },
    {
      code: `
jobs:
  a:
    runs-on: ubuntu-24.04
    fail-fast: true

  b:
    needs: a`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  a:
    needs: 123`,
      errors: [
        {
          messageId: 'unsupportedNeeds',
          line: 4,
          column: 5,
          endLine: 4,
          endColumn: 15,
        },
      ],
    },
  ],
})
