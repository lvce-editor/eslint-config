import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-conditional-spread.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-conditional-spread', rule, {
  invalid: [
    {
      code: `
const dom = [
  {
    childCount: 1,
    type: VirtualDomElements.Div,
  },
  ...(coverImageUrl
    ? [
        {
          alt: \`\${card.name} cover\`,
          childCount: 0,
          src: coverImageUrl,
          type: VirtualDomElements.Img,
        },
      ]
    : []),
]
`,
      errors: [
        {
          messageId: 'noConditionalSpread',
        },
      ],
    },
    {
      code: `
const dom = [
  ...(enabled
    ? [
        {
          childCount: 0,
          type: VirtualDomElements.Div,
        },
      ]
    : []),
]
`,
      errors: [
        {
          messageId: 'noConditionalSpread',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const dom = [
  {
    childCount: children.length,
    type: VirtualDomElements.Div,
  },
  ...getChildren(enabled),
]
`,
    },
    {
      code: `
const values = [
  ...(enabled ? ['one'] : []),
]
`,
    },
  ],
})
