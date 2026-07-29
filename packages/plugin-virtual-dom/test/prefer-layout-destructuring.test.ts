import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-layout-destructuring.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('prefer-layout-destructuring', rule, {
  invalid: [
    {
      code: `
const count = layout.groups.length
`,
      errors: [
        {
          column: 15,
          endColumn: 28,
          endLine: 2,
          line: 2,
          messageId: 'preferLayoutDestructuring',
        },
      ],
    },
    {
      code: `
const activeGroup = layout.activeGroup
`,
      errors: [
        {
          column: 21,
          endColumn: 39,
          endLine: 2,
          line: 2,
          messageId: 'preferLayoutDestructuring',
        },
      ],
    },
    {
      code: `
getVisibleGroups(layout.groups)
`,
      errors: [
        {
          column: 18,
          endColumn: 31,
          endLine: 2,
          line: 2,
          messageId: 'preferLayoutDestructuring',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const { groups } = layout
`,
    },
    {
      code: `
const nextLayout = { ...layout }
`,
    },
    {
      code: `
layout.groups = []
`,
    },
    {
      code: `
const groups = otherLayout.groups
`,
    },
    {
      code: `
const groups = layout[key]
`,
    },
  ],
})
