import { RuleTester } from 'eslint'
import * as rule from '../src/rules/clickable-div-needs-role.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('clickable-div-needs-role', rule, {
  invalid: [
    {
      code: `
const dom = {
  childCount: 0,
  onClick: DomEventListenerFunctions.HandleClick,
  type: VirtualDomElements.Div,
}
`,
      errors: [
        {
          messageId: 'clickableDivNeedsRole',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const dom = {
  childCount: 0,
  onClick: DomEventListenerFunctions.HandleClick,
  role: AriaRoles.Button,
  type: VirtualDomElements.Div,
}
`,
    },
    {
      code: `
const dom = {
  childCount: 0,
  onClick: DomEventListenerFunctions.HandleClick,
  type: VirtualDomElements.Button,
}
`,
    },
  ],
})
