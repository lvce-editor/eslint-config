import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-shared-event-listener-handlers.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-shared-event-listener-handlers', rule, {
  invalid: [
    {
      code: `
const eventListeners = [
  {
    name: 'handleCardLabelPickerPointerDown',
    params: ['handlePointerDown', 'event.currentTarget.name'],
    preventDefault: true,
  },
]
`,
      errors: [
        {
          data: {
            handler: 'handlePointerDown',
            name: 'handleCardLabelPickerPointerDown',
          },
          messageId: 'noSharedEventListenerHandler',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const eventListeners = [
  {
    name: 'handleCardLabelPickerPointerDown',
    params: ['handleCardLabelPickerPointerDown', 'event.currentTarget.name'],
    preventDefault: true,
  },
]
`,
    },
    {
      code: `
const eventListeners = [
  {
    name: 'handleContextMenu',
    params: [],
    preventDefault: true,
  },
]
`,
    },
    {
      code: `
const request = {
  name: 'request',
  params: ['sendRequest'],
}
`,
    },
    {
      code: `
const eventListener = {
  name: DomEventListenerFunctions.HandleClick,
  params: ['handleClick'],
}
`,
    },
  ],
})
