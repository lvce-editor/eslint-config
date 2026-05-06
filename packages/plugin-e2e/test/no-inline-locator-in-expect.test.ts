import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-inline-locator-in-expect.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-inline-locator-in-expect', rule, {
  valid: [
    {
      code: `
async function test() {
  const chatModelPicker = Locator('.ChatModelPicker')
  await expect(chatModelPicker).toBeVisible()
}
`,
    },
  ],
  invalid: [
    {
      code: `
async function test() {
  await expect(Locator('.ChatModelPicker')).toBeVisible()
}
`,
      errors: [{ messageId: 'noInlineLocatorInExpect' }],
    },
    {
      code: `
async function test() {
  await expect(Locator('.ChatModelPicker').first()).toBeVisible()
}
`,
      errors: [{ messageId: 'noInlineLocatorInExpect' }],
    },
  ],
})