import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-lazy-nth-variable-name.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-lazy-nth-variable-name', rule, {
  invalid: [
    {
      code: `
async function test() {
  const rowsNth0 = rows.nth(0)
  await expect(rowsNth0).toBeVisible()
}
`,
      errors: [{ messageId: 'noLazyNthVariableName' }],
    },
    {
      code: `
async function test() {
  const nth0Row = rows.nth(0).locator('.value')
  await expect(nth0Row).toBeVisible()
}
`,
      errors: [{ messageId: 'noLazyNthVariableName' }],
    },
  ],
  valid: [
    {
      code: `
async function test() {
  const row0 = rows.nth(0)
  await expect(row0).toBeVisible()
}
`,
    },
    {
      code: `
async function test() {
  const firstRow = rows.nth(0)
  await expect(firstRow).toBeVisible()
}
`,
    },
    {
      code: `
async function test() {
  const rowsNth0 = rows
  await expect(rowsNth0).toBeVisible()
}
`,
    },
  ],
})
