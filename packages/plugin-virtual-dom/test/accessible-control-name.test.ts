import { RuleTester } from 'eslint'
import * as rule from '../src/rules/accessible-control-name.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

ruleTester.run('accessible-control-name', rule, {
  invalid: [
    {
      code: `const node = { childCount: 0, type: Elements.Button }`,
      errors: [{ messageId: 'accessibleControlName' }],
    },
    {
      code: `const node = { childCount: 0, type: Elements.TextArea }`,
      errors: [{ messageId: 'accessibleControlName' }],
    },
  ],
  valid: [
    `const node = { ariaLabel: label, childCount: 0, type: Elements.Button }`,
    `const node = { childCount: 1, type: Elements.Button }`,
    `const node = { childCount: 0, title, type: Elements.Input }`,
  ],
})
