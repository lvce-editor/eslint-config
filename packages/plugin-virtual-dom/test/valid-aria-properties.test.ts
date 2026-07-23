import { RuleTester } from 'eslint'
import * as rule from '../src/rules/valid-aria-properties.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

ruleTester.run('valid-aria-properties', rule, {
  invalid: [
    {
      code: `const node = { ariaActiveDescendant: id, childCount: 0, type: Elements.Div }`,
      errors: [{ messageId: 'validAriaProperty' }],
    },
  ],
  valid: [
    `const node = { ariaActivedescendant: id, ariaLabelledBy: labelId, childCount: 0, type: Elements.Div }`,
    `const value = { ariaActiveDescendant: id, type: StateType.Tree }`,
  ],
})
