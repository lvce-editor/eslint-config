import { RuleTester } from 'eslint'
import { parseYAML } from 'yaml-eslint-parser'
import * as rule from '../src/rules/node-version-file.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: { parse: parseYAML },
    ecmaVersion: 2020,
  },
})

ruleTester.run('nodeVersionFile', rule, {
  valid: [
    {
      code: `
jobs:
  publish-release:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/setup-node@v6
        with:
          node-version-file: '.nvmrc'`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  publish-release:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/setup-node@v6
        with:
          node-version-file: abc`,
      errors: [
        {
          messageId: 'unsupportedNodeVersionFile',
          column: 11,
          endColumn: 33,
          endLine: 8,
          line: 8,
        },
      ],
    },
  ],
})
