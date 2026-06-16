import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/no-write-all-permissions.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('noWriteAllPermissions', rule, {
  valid: [
    {
      code: `
permissions:
  contents: read`,
    },
  ],
  invalid: [
    {
      code: `
permissions: write-all`,
      errors: [
        {
          messageId: 'writeAllPermissions',
        },
      ],
    },
  ],
})
