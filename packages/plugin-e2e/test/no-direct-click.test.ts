import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-direct-click.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-direct-click', rule, {
  invalid: [
    {
      code: `
async function test() {
  await agentModePickerToggle.click()
}
`,
      errors: [{ messageId: 'noDirectClick' }],
    },
    {
      code: `
async function test() {
  await Locator('.ChatModelPicker').click()
}
`,
      errors: [{ messageId: 'noDirectClick' }],
    },
  ],
  valid: [
    {
      code: `
async function test() {
  await Command.execute('AgentModePicker.select')
}
`,
    },
    {
      code: `
async function test() {
  await agentModePicker.clickOption()
}
`,
    },
  ],
})
