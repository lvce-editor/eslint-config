import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/working-directory.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('working-directory', rule, {
  valid: [
    {
      code: `
jobs:
  ci:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v5
      - run: npm test
        working-directory: dist
`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  ci:
    runs-on: ubuntu-24.04
    steps:
      - run: npm test
        working-directory: 123
`,
      errors: [
        {
          messageId: 'workingDirectoryMustBeOfTypeString',
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 31,
        },
      ],
    },
  ],
})
