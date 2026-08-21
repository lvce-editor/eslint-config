import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-timeouts.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-timeouts', rule, {
  invalid: [
    {
      code: `
async function test() {
  await new Promise((resolve) => setTimeout(resolve, 500))
}
`,
      errors: [{ messageId: 'noTimeouts' }],
    },
    {
      code: `
async function test() {
  await new Promise((resolve) => globalThis.setTimeout(resolve, 500))
}
`,
      errors: [{ messageId: 'noTimeouts' }],
    },
  ],
  valid: [
    {
      code: `
async function test() {
  await expect(locator).toBeVisible()
}
`,
    },
  ],
})
