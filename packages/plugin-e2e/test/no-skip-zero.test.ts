import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-skip-zero.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-skip-zero', rule, {
  invalid: [
    {
      code: `
import { Test } from '@lvce-editor/test-with-playwright'

export const skip = 0

export const test = async () => Test
`,
      errors: [{ messageId: 'noSkipZero' }],
      output: `
import { Test } from '@lvce-editor/test-with-playwright'

export const test = async () => Test
`,
    },
    {
      code: `export const skip = 0
export const test = async () => {}`,
      errors: [{ messageId: 'noSkipZero' }],
      output: `export const test = async () => {}`,
    },
  ],
  valid: [
    {
      code: `export const skip = true`,
    },
    {
      code: `export const skip = 1`,
    },
    {
      code: `const skip = 0`,
    },
    {
      code: `export const skipped = 0`,
    },
  ],
})
