import { RuleTester } from 'eslint'
import * as rule from '../src/rules/valid-aria-values.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

ruleTester.run('valid-aria-values', rule, {
  invalid: [
    {
      code: `const node = { ariaLive: 'loud', childCount: 0, type: Elements.Div }`,
      errors: [{ messageId: 'validAriaValue' }],
    },
  ],
  valid: [`const node = { ariaLive: 'polite', childCount: 0, type: Elements.Div }`, `const node = { ariaLive, childCount: 0, type: Elements.Div }`],
})
