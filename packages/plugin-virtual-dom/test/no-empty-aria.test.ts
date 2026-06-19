import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-empty-aria.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-empty-aria', rule, {
  invalid: [
    {
      code: `
const dom = {
  ariaDescription: '',
  childCount: 0,
  type: VirtualDomElements.Div,
}
`,
      errors: [
        {
          messageId: 'noEmptyAria',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const dom = {
  ariaLabel: label,
  childCount: 0,
  type: VirtualDomElements.Div,
}
`,
    },
    {
      code: `
const value = {
  ariaDescription: '',
}
`,
    },
  ],
})
