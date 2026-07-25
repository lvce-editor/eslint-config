import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-to-be-hidden.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('prefer-to-be-hidden', rule, {
  invalid: [
    {
      code: `
export const test = async ({ expect }) => {
  await expect(panel).not.toBeVisible()
}
`,
      errors: [{ messageId: 'preferToBeHidden' }],
      output: `
export const test = async ({ expect }) => {
  await expect(panel).toBeHidden()
}
`,
    },
    {
      code: `
export const test = async (api) => {
  await api.expect(panel).not.toBeVisible({ timeout: 1000 })
}
`,
      errors: [{ messageId: 'preferToBeHidden' }],
      output: `
export const test = async (api) => {
  await api.expect(panel).toBeHidden({ timeout: 1000 })
}
`,
    },
  ],
  valid: [
    {
      code: `
export const test = async ({ expect }) => {
  await expect(panel).toBeHidden()
}
`,
    },
    {
      code: `
export const test = async ({ expect }) => {
  await expect(panel).toBeVisible()
}
`,
    },
    {
      code: `
export const test = async ({ expect }) => {
  await expect(panel).not.toBeEnabled()
}
`,
    },
    {
      code: `
export const test = async () => {
  await assertion.not.toBeVisible()
}
`,
    },
  ],
})
