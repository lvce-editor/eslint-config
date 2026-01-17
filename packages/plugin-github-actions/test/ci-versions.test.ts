import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/ci-versions.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('unsupportedCiVersion', rule, {
  valid: [
    {
      code: `
jobs:
  ci:
    strategy:
      matrix:
        os: [ubuntu-24.04, macos-15, windows-2025]
`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  ci:
    strategy:
      matrix:
        os: [ubuntu-20.04, macos-15, windows-2025]`,
      errors: [
        {
          messageId: 'unsupportedCiVersion',
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 26,
        },
      ],
    },
    {
      code: `
jobs:
  ci:
    strategy:
      matrix:
        os: [ubuntu-24.04, macos-12, windows-2025]`,

      errors: [
        {
          messageId: 'unsupportedCiVersion',
          line: 6,
          column: 28,
          endLine: 6,
          endColumn: 36,
        },
      ],
    },
  ],
})
