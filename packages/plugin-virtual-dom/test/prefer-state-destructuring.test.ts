import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-state-destructuring.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('prefer-state-destructuring', rule, {
  invalid: [
    {
      code: `
const count = state.processes.length
`,
      errors: [
        {
          column: 15,
          endColumn: 30,
          endLine: 2,
          line: 2,
          messageId: 'preferStateDestructuring',
        },
      ],
    },
    {
      code: `
const rootPid = state.rootPid
`,
      errors: [
        {
          column: 17,
          endColumn: 30,
          endLine: 2,
          line: 2,
          messageId: 'preferStateDestructuring',
        },
      ],
    },
    {
      code: `
getVisibleProcesses(state.processes)
`,
      errors: [
        {
          column: 21,
          endColumn: 36,
          endLine: 2,
          line: 2,
          messageId: 'preferStateDestructuring',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const { processes } = state
`,
    },
    {
      code: `
const nextState = { ...state }
`,
    },
    {
      code: `
state.processes = []
`,
    },
    {
      code: `
const processes = otherState.processes
`,
    },
    {
      code: `
const processes = state[key]
`,
    },
  ],
})
