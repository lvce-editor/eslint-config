import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/python-version.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('pythonVersion', rule, {
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
          messageId: 'unsupportedPythonVersion',
          column: 11,
          endColumn: 33,
          endLine: 9,
          line: 9,
        },
      ],
    },
  ],
})
