import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-using-mock-rpc.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('prefer-using-mock-rpc', rule, {
  valid: [
    {
      code: `
using mockRpc = iconThemeWorker.registerMockRpc({
  testMethod() {
    return 'ok'
  },
})
`,
    },
    {
      code: `
const mockRpc = createMockRpc()
`,
    },
    {
      code: `
const otherMockRpc = fileSearchWorker.registerMockRpc({
  testMethod() {
    return 'ok'
  },
})
`,
    },
  ],
  invalid: [
    {
      code: `
const mockRpc = testWorker.registerMockRpc({
  testMethod() {
    return 'ok'
  },
})
`,
      errors: [
        {
          messageId: 'preferUsingMockRpc',
          line: 2,
          column: 1,
          endLine: 6,
          endColumn: 3,
        },
      ],
    },
    {
      code: `
let mockRpc = problemsViewWorker.registerMockRpc({
  testMethod() {
    return 'ok'
  },
})
`,
      errors: [
        {
          messageId: 'preferUsingMockRpc',
          line: 2,
          column: 1,
          endLine: 6,
          endColumn: 3,
        },
      ],
    },
  ],
})
