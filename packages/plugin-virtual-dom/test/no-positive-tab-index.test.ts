import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-positive-tab-index.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

ruleTester.run('no-positive-tab-index', rule, {
  invalid: [
    {
      code: `const node = { childCount: 0, tabIndex: 2, type: Elements.Div }`,
      errors: [{ messageId: 'noPositiveTabIndex' }],
    },
  ],
  valid: [`const node = { childCount: 0, tabIndex: 0, type: Elements.Div }`, `const node = { childCount: 0, tabIndex: -1, type: Elements.Div }`],
})
