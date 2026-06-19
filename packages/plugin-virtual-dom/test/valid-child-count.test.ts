import { RuleTester } from 'eslint'
import * as rule from '../src/rules/valid-child-count.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('valid-child-count', rule, {
  invalid: [
    {
      code: `
const dom = [
  {
    childCount: 2,
    type: VirtualDomElements.Div,
  },
  text('hello'),
]
`,
      errors: [
        {
          messageId: 'validChildCount',
        },
      ],
    },
    {
      code: `
const dom = [
  {
    childCount: -1,
    type: VirtualDomElements.Div,
  },
]
`,
      errors: [
        {
          messageId: 'invalidChildCount',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const dom = [
  {
    childCount: 1,
    type: VirtualDomElements.Div,
  },
  text('hello'),
]
`,
    },
    {
      code: `
const dom = [
  {
    childCount: 1,
    type: VirtualDomElements.Div,
  },
  {
    childCount: 1,
    type: VirtualDomElements.Code,
  },
  text('hello'),
]
`,
    },
    {
      code: `
const dom = [
  {
    childCount: children.length,
    type: VirtualDomElements.Div,
  },
  ...children,
]
`,
    },
  ],
})
