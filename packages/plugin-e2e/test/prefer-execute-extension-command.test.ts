import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-execute-extension-command.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('prefer-execute-extension-command', rule, {
  invalid: [
    {
      code: `
async function test() {
  await Command.execute('ExtensionHost.executeCommand', 'git.applyStash')
}
`,
      errors: [{ messageId: 'preferExecuteExtensionCommand' }],
      output: `
async function test() {
  await Command.executeExtensionCommand('git.applyStash')
}
`,
    },
    {
      code: `
async function test(fixtureUrl) {
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
}
`,
      errors: [{ messageId: 'preferExecuteExtensionCommand' }],
      output: `
async function test(fixtureUrl) {
  await Command.executeExtensionCommand('git.loadFixture', fixtureUrl)
}
`,
    },
    {
      code: `
async function test(commandId, fixtureUrl) {
  await Command.execute('ExtensionHost.executeCommand', commandId ?? 'git.loadFixture', fixtureUrl)
}
`,
      errors: [{ messageId: 'preferExecuteExtensionCommand' }],
      output: `
async function test(commandId, fixtureUrl) {
  await Command.executeExtensionCommand(commandId ?? 'git.loadFixture', fixtureUrl)
}
`,
    },
  ],
  valid: [
    {
      code: `
async function test() {
  await Command.executeExtensionCommand('git.applyStash')
}
`,
    },
    {
      code: `
async function test() {
  await Command.execute('SomeOtherCommand', 'git.applyStash')
}
`,
    },
    {
      code: `
async function test() {
  await OtherCommand.execute('ExtensionHost.executeCommand', 'git.applyStash')
}
`,
    },
    {
      code: `
async function test() {
  await Command.execute('ExtensionHost.executeCommand')
}
`,
    },
  ],
})
