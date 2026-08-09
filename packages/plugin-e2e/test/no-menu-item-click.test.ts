import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-menu-item-click.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-menu-item-click', rule, {
  invalid: [
    {
      code: `
async function test() {
  const copyImage = Locator('.MenuItem').nth(1)
  await copyImage.click()
}
`,
      errors: [{ messageId: 'noMenuItemClick' }],
    },
    {
      code: `
async function test() {
  await Locator('.MenuItem').click()
}
`,
      errors: [{ messageId: 'noMenuItemClick' }],
    },
    {
      code: `
async function test() {
  await Locator('.MenuItem').nth(1).click()
}
`,
      errors: [{ messageId: 'noMenuItemClick' }],
    },
  ],
  valid: [
    {
      code: `
async function test() {
  await ContextMenu.selectItem('Copy Image')
}
`,
    },
    {
      code: `
async function test() {
  const button = Locator('.Button')
  await button.click()
}
`,
    },
    {
      code: `
async function test() {
  const menuItem = Locator('.MenuItem')
  await expect(menuItem).toHaveText('Copy Image')
}
`,
    },
  ],
})
