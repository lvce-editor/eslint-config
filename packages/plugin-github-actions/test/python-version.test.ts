import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/python-version.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('pythonVersion', rule, {
  invalid: [
    {
      code: `
jobs:
  publish-release:
    runs-on: ubuntu-24.04
    steps:
      - name: Use Python 3.11
        uses: actions/setup-python@5
        with:
          python-version: '3.11'`,
      errors: [
        {
          column: 11,
          endColumn: 33,
          endLine: 9,
          line: 9,
          messageId: 'unsupportedPythonVersion',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
jobs:
  publish-release:
    runs-on: ubuntu-24.04
    steps:
      - name: Use Python 3.13
        uses: actions/setup-python@5
        with:
          python-version: '3.13'`,
    },
  ],
})
