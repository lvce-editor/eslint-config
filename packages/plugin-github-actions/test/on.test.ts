import { RuleTester } from 'eslint'
import { parseYAML } from 'yaml-eslint-parser'
import * as rule from '../src/rules/on.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: { parse: parseYAML },
    ecmaVersion: 2020,
  },
})

ruleTester.run('on', rule, {
  valid: [
    {
      code: `
on:
  push:
  pull_request:
    branches:
      - main`,
    },
  ],
  invalid: [
    {
      code: `
on:
  abc:`,
      errors: [
        {
          messageId: 'unsupportedOn',
          column: 1,
          endColumn: 7,
          endLine: 3,
          line: 2,
        },
      ],
    },
  ],
})
