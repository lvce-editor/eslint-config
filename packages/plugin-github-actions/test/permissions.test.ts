import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/permissions.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('permissions', rule, {
  valid: [
    {
      code: `
permissions:
  id-token: write
  contents: write`,
    },
  ],
  invalid: [
    {
      code: `permissions:
  id-token: abc
  contents: write`,
      errors: [
        {
          messageId: 'unsupportedPermission',
          column: 1,
          endColumn: 18,
          endLine: 3,
          line: 1,
        },
      ],
    },
  ],
})
