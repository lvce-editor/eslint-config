import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/npm-registry.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('npmRegistry', rule, {
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
          messageId: 'unsupportedNpmRegistry',
          column: 9,
          endColumn: 44,
          endLine: 7,
          line: 7,
        },
      ],
    },
  ],
})
