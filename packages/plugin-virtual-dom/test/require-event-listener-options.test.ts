import { RuleTester } from 'eslint'
import * as rule from '../src/rules/require-event-listener-options.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('require-event-listener-options', rule, {
  invalid: [
    {
      code: `
const listener = {
  name: 'handleDragOver',
  params: ['handleDragOver'],
}
`,
      errors: [
        {
          messageId: 'requirePreventDefault',
        },
      ],
    },
    {
      code: `
const listener = {
  name: 'handleDrop',
  params: ['handleDrop'],
  preventDefault: false,
}
`,
      errors: [
        {
          messageId: 'requirePreventDefault',
        },
      ],
    },
    {
      code: `
const listener = {
  name: 'handleDrop',
  params: ['handleDrop'],
  preventDefault,
}
`,
      errors: [
        {
          messageId: 'requirePreventDefault',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const listener = {
  name: 'handleDragOver',
  params: ['handleDragOver'],
  preventDefault: true,
}
`,
    },
    {
      code: `
const listener = {
  name: 'handleDrop',
  params: ['handleDrop'],
  preventDefault: true,
}
`,
    },
    {
      code: `
const listener = {
  name: 'handleClick',
  params: ['handleClick'],
}
`,
    },
    {
      code: `
const unrelated = {
  name: 'handleDrop',
}
`,
    },
  ],
})
