import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/npm-registry.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('npmRegistry', rule, {
  invalid: [
    {
      code: `jobs:
build-release:
  runs-on: ubuntu-24.04
  steps:
    - uses: actions/setup-node@v6
      with:
        registry-url: 'https://example.com'`,
      errors: [
        {
          column: 9,
          endColumn: 44,
          endLine: 7,
          line: 7,
          messageId: 'unsupportedNpmRegistry',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
jobs:
  build-release:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/setup-node@v6
        with:
          registry-url: 'https://registry.npmjs.org'`,
    },
  ],
})
