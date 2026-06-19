import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-inline-event-handlers.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-inline-event-handlers', rule, {
  invalid: [
    {
      code: `
const dom = {
  childCount: 0,
  onClick: () => {},
  type: VirtualDomElements.Button,
}
`,
      errors: [
        {
          messageId: 'noInlineEventHandlers',
        },
      ],
    },
    {
      code: `
const dom = {
  childCount: 0,
  onClick: 'handleClick',
  type: VirtualDomElements.Button,
}
`,
      errors: [
        {
          messageId: 'noInlineEventHandlers',
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
  type: VirtualDomElements.Button,
}
`,
    },
    {
      code: `
const dom = {
  childCount: 0,
  onClick,
  type: VirtualDomElements.Button,
}
`,
    },
  ],
})
