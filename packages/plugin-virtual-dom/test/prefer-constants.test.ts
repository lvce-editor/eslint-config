import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-constants.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('prefer-constants', rule, {
  invalid: [
    {
      code: `
const dom = {
  childCount: 0,
  type: 4,
}
`,
      errors: [
        {
          messageId: 'preferTypeConstant',
        },
      ],
    },
    {
      code: `
const dom = {
  childCount: 0,
  role: 'button',
  type: VirtualDomElements.Div,
}
`,
      errors: [
        {
          messageId: 'preferRoleConstant',
        },
      ],
    },
    {
      code: `
const dom = {
  childCount: 0,
  tabIndex: 0,
  type: VirtualDomElements.Div,
}
`,
      errors: [
        {
          messageId: 'preferTabIndexConstant',
        },
      ],
    },
    {
      code: `
const dom = {
  ariaModal: 'true',
  childCount: 0,
  type: VirtualDomElements.Div,
}
`,
      errors: [
        {
          messageId: 'preferAriaBooleanConstant',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const dom = {
  ariaModal: AriaBoolean.True,
  childCount: 0,
  role: AriaRoles.Button,
  tabIndex: TabIndex.Focusable,
  type: VirtualDomElements.Div,
}
`,
    },
    {
      code: `
const value = {
  role: 'button',
  tabIndex: 0,
}
`,
    },
  ],
})
