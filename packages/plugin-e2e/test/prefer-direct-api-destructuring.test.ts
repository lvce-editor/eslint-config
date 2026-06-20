import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-direct-api-destructuring.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('prefer-direct-api-destructuring', rule, {
  invalid: [
    {
      code: `
export const test = async (api) => {
  const { DiffView, expect, FileSystem, Locator } = api
  await expect(Locator('.View')).toBeVisible()
}
`,
      errors: [{ messageId: 'preferDirectApiDestructuring' }],
    },
    {
      code: `
async function test(api) {
  const { expect } = api
  await expect(1).toBe(1)
}
`,
      errors: [{ messageId: 'preferDirectApiDestructuring' }],
    },
  ],
  valid: [
    {
      code: `
export const test = async ({ DiffView, expect, FileSystem, Locator }) => {
  await expect(Locator('.View')).toBeVisible()
}
`,
    },
    {
      code: `
export const test = async (api) => {
  const { DiffView } = otherApi
  await api.expect(DiffView).toBeVisible()
}
`,
    },
    {
      code: `
export const test = async ({ api }) => {
  const { DiffView } = api
  await DiffView.open()
}
`,
    },
  ],
})
