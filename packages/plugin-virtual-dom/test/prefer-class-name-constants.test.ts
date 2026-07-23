import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-class-name-constants.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

ruleTester.run('prefer-class-name-constants', rule, {
  invalid: [
    {
      code: `const node = { childCount: 0, className: 'Button', type: Elements.Button }`,
      errors: [{ messageId: 'preferClassNameConstant' }],
    },
  ],
  valid: [
    `const node = { childCount: 0, className: ClassNames.Button, type: Elements.Button }`,
    `const node = { childCount: 0, className: 'Button Primary', type: Elements.Button }`,
  ],
})
