import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-element-helper.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-element-helper', rule, {
  invalid: [
    {
      code: `element(VirtualDomElements.Div, { className: ClassNames.DrawView }, [])`,
      errors: [{ messageId: 'noElementHelper' }],
    },
    {
      code: `element(VirtualDomElements.Span, { ariaLabel: 'CPU profile' })`,
      errors: [{ messageId: 'noElementHelper' }],
    },
    {
      code: `
const element = (type, properties = {}, children = []) => ({
  children,
  node: {
    ...properties,
    childCount: children.length,
    type,
  },
})

const tree = element(VirtualDomElements.Div, { className: 'CpuProfileView' }, [
  element(VirtualDomElements.Span, { className: 'CpuProfileTitle' }),
])
`,
      errors: [{ messageId: 'noElementHelper' }, { messageId: 'noElementHelper' }],
    },
  ],
  valid: [
    `element('div', { className: 'DrawView' })`,
    `element(type, properties, children)`,
    `helpers.element(VirtualDomElements.Div, { className: ClassNames.DrawView }, [])`,
    `createElement(VirtualDomElements.Div, { className: ClassNames.DrawView }, [])`,
    `const node = { childCount: 0, className: ClassNames.DrawView, type: VirtualDomElements.Div }`,
  ],
})
