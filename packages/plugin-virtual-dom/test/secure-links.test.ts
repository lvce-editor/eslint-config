import { RuleTester } from 'eslint'
import * as rule from '../src/rules/secure-links.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('secure-links', rule, {
  invalid: [
    {
      code: `
const dom = {
  childCount: 1,
  href: url,
  type: VirtualDomElements.A,
}
`,
      errors: [
        {
          messageId: 'secureLinkTarget',
        },
        {
          messageId: 'secureLinkRel',
        },
      ],
    },
    {
      code: `
const dom = {
  childCount: 1,
  href: url,
  rel: 'noopener noreferrer',
  target: '_self',
  type: VirtualDomElements.A,
}
`,
      errors: [
        {
          messageId: 'secureLinkTarget',
        },
      ],
    },
    {
      code: `
const dom = {
  childCount: 1,
  href: url,
  rel: 'noopener',
  target: '_blank',
  type: VirtualDomElements.A,
}
`,
      errors: [
        {
          messageId: 'secureLinkRel',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const dom = {
  childCount: 1,
  href: url,
  rel: 'noopener noreferrer',
  target: '_blank',
  type: VirtualDomElements.A,
}
`,
    },
    {
      code: `
const dom = {
  childCount: 0,
  type: VirtualDomElements.A,
}
`,
    },
    {
      code: `
const dom = {
  childCount: 0,
  href: url,
  type: VirtualDomElements.Button,
}
`,
    },
  ],
})
