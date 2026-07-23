import { RuleTester } from 'eslint'
import * as rule from '../src/rules/require-image-alt.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

ruleTester.run('require-image-alt', rule, {
  invalid: [
    {
      code: `const node = { childCount: 0, src, type: Elements.Img }`,
      errors: [{ messageId: 'requireImageAlt' }],
    },
  ],
  valid: [`const node = { alt: '', childCount: 0, src, type: Elements.Img }`],
})
