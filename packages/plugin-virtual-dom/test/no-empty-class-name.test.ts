import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-empty-class-name.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-empty-class-name', rule, {
  invalid: [
    {
      code: `
const dom = {
  childCount: 0,
  className: '',
  type: VirtualDomElements.Div,
}
`,
      errors: [
        {
          messageId: 'noEmptyClassName',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const dom = {
  childCount: 0,
  className: ClassNames.Button,
  type: VirtualDomElements.Div,
}
`,
    },
    {
      code: `
const value = {
  className: '',
}
`,
    },
  ],
})
