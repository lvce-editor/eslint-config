import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-using-mock-rpc.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('prefer-using-mock-rpc', rule, {
  invalid: [
    {
      code: `
const mockRpc = SearchProcess.registerMockRpc({
  testMethod() {
    return 'ok'
  },
})
`,
      errors: [
        {
          column: 1,
          endColumn: 3,
          endLine: 6,
          line: 2,
          messageId: 'preferUsingMockRpc',
        },
      ],
    },
    {
      code: `
let mockRpc = MainProcess.registerMockRpc({
  testMethod() {
    return 'ok'
  },
})
`,
      errors: [
        {
          column: 1,
          endColumn: 3,
          endLine: 6,
          line: 2,
          messageId: 'preferUsingMockRpc',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
using mockRpc = SearchProcess.registerMockRpc({
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
    {
      code: `
const mainProcessMockRpc = MainProcess.registerMockRpc({
  testMethod() {
    return 'ok'
  },
})
`,
    },
  ],
})
