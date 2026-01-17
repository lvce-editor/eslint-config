import { RuleTester } from 'eslint'
import { parseYAML } from 'yaml-eslint-parser'
import * as rule from '../src/rules/shell.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parseYAML,
    ecmaVersion: 2020,
  },
})

ruleTester.run('maxParallel', rule, {
  valid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    shell: bash`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    shell: abc`,
      errors: [
        {
          messageId: 'unsupportedShell',
          line: 5,
          column: 5,
          endLine: 5,
          endColumn: 15,
        },
      ],
    },
  ],
})
