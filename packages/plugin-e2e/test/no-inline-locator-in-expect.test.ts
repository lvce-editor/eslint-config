import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-inline-locator-in-expect.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-inline-locator-in-expect', rule, {
  invalid: [
    {
      code: "expect(card.locator('.ComponentStateCardTitle')).toHaveText(component.displayName || component.moduleId)",
      errors: [{ messageId: 'noInlineLocatorInExpect' }],
    },
    {
      code: "expect(card.locator('.Title').first()).toBeVisible()",
      errors: [{ messageId: 'noInlineLocatorInExpect' }],
    },
    {
      code: "expect(card?.locator('.Title')).toBeVisible()",
      errors: [{ messageId: 'noInlineLocatorInExpect' }],
    },
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
  valid: [
    "const title = card.locator('.Title'); expect(title).toHaveText('Title')",
    "expect(card.textContent()).toBe('Title')",
    "card.locator('.Title')",
    'expect(card.locator).toBeDefined()',
    {
      code: `
async function test() {
  const chatModelPicker = Locator('.ChatModelPicker')
  await expect(chatModelPicker).toBeVisible()
}
`,
    },
  ],
})
