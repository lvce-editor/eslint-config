import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-raw-text-children.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-raw-text-children', rule, {
  invalid: [
    {
      code: `
const dom = [
  {
    childCount: 1,
    type: VirtualDomElements.Div,
  },
  'hello',
]
`,
      errors: [
        {
          messageId: 'noRawTextChildren',
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
const items = ['hello', 'world']
`,
    },
  ],
})
