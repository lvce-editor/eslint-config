import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/working-directory.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('working-directory', rule, {
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
          column: 9,
          endColumn: 31,
          endLine: 7,
          line: 7,
          messageId: 'workingDirectoryMustBeOfTypeString',
        },
      ],
    },
  ],
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
})
