import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-nullish-attribute-values.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

ruleTester.run('no-nullish-attribute-values', rule, {
  invalid: [
    {
      code: `const node = { childCount: 0, href: undefined, type: Elements.A }`,
      errors: [{ messageId: 'noNullishAttributeValue' }],
    },
    {
      code: `const node = { childCount: 0, href: props?.href, type: Elements.A }`,
      errors: [{ messageId: 'noNullishAttributeValue' }],
    },
  ],
  valid: [`const node = { childCount: 0, type: Elements.A, ...(href ? { href } : {}) }`, `const value = { href: undefined, type: CellType.Link }`],
})
