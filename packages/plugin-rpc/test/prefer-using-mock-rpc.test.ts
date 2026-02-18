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
using mockRpc = RendererWorker.registerMockRpc({
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
const otherMockRpc = RendererWorker.registerMockRpc({
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
const mockRpc = RendererWorker.registerMockRpc({
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
let mockRpc = RendererWorker.registerMockRpc({
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
