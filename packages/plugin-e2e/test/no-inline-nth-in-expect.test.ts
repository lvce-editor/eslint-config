import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-inline-nth-in-expect.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-inline-nth-in-expect', rule, {
  valid: [
    {
      code: `
async function test() {
  const firstPill = pills.nth(0)
  await expect(firstPill).toBeVisible()
}
`,
    },
  ],
  invalid: [
    {
      code: `
async function test() {
  await expect(pills.nth(0)).toBeVisible()
}
`,
      errors: [{ messageId: 'noInlineNthInExpect' }],
    },
    {
      code: `
async function test() {
  await expect(pills.nth(0)).toContainText('All')
}
`,
      errors: [{ messageId: 'noInlineNthInExpect' }],
    },
    {
      code: `
async function test() {
  await expect(pills.nth(0)!).toBeVisible()
}
`,
      errors: [{ messageId: 'noInlineNthInExpect' }],
    },
  ],
})