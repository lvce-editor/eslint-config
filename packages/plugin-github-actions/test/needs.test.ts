import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/needs.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('needs', rule, {
  invalid: [
    {
      code: `
jobs:
  a:
    needs: 123`,
      errors: [
        {
          column: 5,
          endColumn: 15,
          endLine: 4,
          line: 4,
          messageId: 'unsupportedNeeds',
        },
      ],
    },
    {
      code: `
jobs:
  a:
    runs-on: ubuntu-24.04
    fail-fast: true

  b:
    needs: ["c"]`,
      errors: [
        {
          column: 5,
          endColumn: 17,
          endLine: 8,
          line: 8,
          messageId: 'unsupportedNeeds',
        },
      ],
    },
    {
      code: `
jobs:
  a:
    runs-on: ubuntu-24.04
    fail-fast: true

  b:
    needs: c`,
      errors: [
        {
          column: 5,
          endColumn: 13,
          endLine: 8,
          line: 8,
          messageId: 'unsupportedNeeds',
        },
      ],
    },
  ],
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
    needs: [a]`,
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
})
