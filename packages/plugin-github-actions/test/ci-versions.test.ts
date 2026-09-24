import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/ci-versions.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('unsupportedCiVersion', rule, {
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
          column: 14,
          endColumn: 26,
          endLine: 6,
          line: 6,
          messageId: 'unsupportedCiVersion',
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
          column: 28,
          endColumn: 36,
          endLine: 6,
          line: 6,
          messageId: 'unsupportedCiVersion',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
jobs:
  direct:
    runs-on: ubuntu-26.04
  arm:
    runs-on: ubuntu-26.04-arm
  ci:
    strategy:
      matrix:
        os: [ubuntu-24.04, ubuntu-24.04-arm, ubuntu-26.04, ubuntu-26.04-arm, macos-15, windows-2025]
    runs-on: \${{ matrix.os }}
`,
    },
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
})
