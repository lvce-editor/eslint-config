import { RuleTester } from 'eslint'
import tseslint from 'typescript-eslint'
import * as rule from '../src/rules/no-text-helper.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    parser: tseslint.parser,
    sourceType: 'module',
  },
})

ruleTester.run('no-text-helper', rule, {
  invalid: [
    {
      code: `const text = (value: string): VirtualDomNode => ({ childCount: 0, text: value, type: VirtualDomElements.Text })`,
      errors: [{ messageId: 'noTextHelper' }],
    },
    {
      code: `const text = function (value) { return { childCount: 0, text: value, type: VirtualDomElements.Text } }`,
      errors: [{ messageId: 'noTextHelper' }],
    },
    {
      code: `function text(value) { return { childCount: 0, text: value, type: VirtualDomElements.Text } }`,
      errors: [{ messageId: 'noTextHelper' }],
    },
  ],
  valid: [
    `import { text } from '@lvce-editor/virtual-dom'`,
    `import { text } from '@lvce-editor/virtual-dom-worker'`,
    `const text = 'Hello'`,
    `const getText = (value) => value`,
    `const helpers = { text: (value) => value }`,
  ],
})
