import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-inline-style.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-inline-style', rule, {
  invalid: [
    {
      code: `
const dom = {
  childCount: 0,
  style: 'color: red',
  type: VirtualDomElements.Div,
}
`,
      errors: [
        {
          messageId: 'noInlineStyle',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const dom = {
  childCount: 0,
  className: ClassNames.Error,
  type: VirtualDomElements.Div,
}
`,
    },
  ],
})
