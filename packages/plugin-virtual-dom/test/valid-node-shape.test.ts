import { RuleTester } from 'eslint'
import * as rule from '../src/rules/valid-node-shape.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

ruleTester.run('valid-node-shape', rule, {
  invalid: [
    {
      code: `const node = { type: Elements.Div }`,
      errors: [{ messageId: 'missingChildCount' }],
    },
    {
      code: `const node = { childCount: 1, type: VirtualDomElements.Img }`,
      errors: [{ messageId: 'voidElementChildren' }],
    },
    {
      code: `const node = { childCount: 0, text: 'icon', type: VirtualDomElements.Span }`,
      errors: [{ messageId: 'elementTextProperty' }],
    },
  ],
  valid: [
    `const childCount = 1; const node = { childCount, type: Elements.Div }`,
    `const node = { childCount: 0, text: 'value', type: VirtualDomElements.Text }`,
    `const value = { text: 'value', type: CellType.Text }`,
  ],
})
