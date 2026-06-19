import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-object-attribute-values.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-object-attribute-values', rule, {
  invalid: [
    {
      code: `
const dom = {
  childCount: 0,
  dataset: {},
  type: VirtualDomElements.Div,
}
`,
      errors: [
        {
          messageId: 'noObjectAttributeValues',
        },
      ],
    },
    {
      code: `
const dom = {
  childCount: 0,
  dataItems: [],
  type: VirtualDomElements.Div,
}
`,
      errors: [
        {
          messageId: 'noObjectAttributeValues',
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
const dom = {
  childCount: 0,
  onClick: DomEventListenerFunctions.HandleClick,
  type: VirtualDomElements.Button,
}
`,
    },
  ],
})
