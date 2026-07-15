import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-lazy-date-time-format.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('prefer-lazy-date-time-format', rule, {
  invalid: [
    {
      code: `
const messageDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})
`,
      errors: [
        {
          messageId: 'preferLazyDateTimeFormat',
        },
      ],
    },
    {
      code: `
const messageDateFormatter = Intl.DateTimeFormat()
`,
      errors: [
        {
          messageId: 'preferLazyDateTimeFormat',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const getMessageDateFormatter = (() => {
  let messageDateFormatter
  return () => {
    messageDateFormatter ??= new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    return messageDateFormatter
  }
})()
`,
    },
    {
      code: `
const valueFormatter = new Intl.NumberFormat()
`,
    },
  ],
})
