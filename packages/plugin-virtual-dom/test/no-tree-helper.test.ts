import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-tree-helper.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-tree-helper', rule, {
  invalid: [
    {
      code: `tree(VirtualDomElements.Div, { className: ClassNames.DrawView }, [])`,
      errors: [{ messageId: 'noTreeHelper' }],
    },
    {
      code: `tree(VirtualDomElements.Div, { 'className': ClassNames.DrawView }, [])`,
      errors: [{ messageId: 'noTreeHelper' }],
    },
    {
      code: `const className = ClassNames.DrawView; tree(VirtualDomElements.Div, { className }, [])`,
      errors: [{ messageId: 'noTreeHelper' }],
    },
  ],
  valid: [
    `tree(VirtualDomElements.Div, { ariaLabel: 'Draw view' }, [])`,
    `tree(VirtualDomElements.Div, attributes, [])`,
    `tree(VirtualDomElements.Div, undefined, [])`,
    `createTree(VirtualDomElements.Div, { className: ClassNames.DrawView }, [])`,
    `helpers.tree(VirtualDomElements.Div, { className: ClassNames.DrawView }, [])`,
    `const node = { childCount: 0, className: ClassNames.DrawView, type: VirtualDomElements.Div }`,
  ],
})
