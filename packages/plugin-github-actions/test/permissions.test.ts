import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/permissions.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('permissions', rule, {
  invalid: [
    {
      code: `permissions:
  id-token: abc
  contents: write`,
      errors: [
        {
          column: 1,
          endColumn: 18,
          endLine: 3,
          line: 1,
          messageId: 'unsupportedPermission',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
permissions:
  id-token: write
  contents: write`,
    },
  ],
})
