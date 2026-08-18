import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-url-can-parse.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('prefer-url-can-parse', rule, {
  invalid: [
    {
      code: `
let url
try {
  url = new URL(value)
} catch {
  throw new Error('Enter a valid GitHub pull request URL')
}
`,
      errors: [{ messageId: 'preferUrlCanParse' }],
    },
    {
      code: `
try {
  if (shouldParse) {
    parsedUrl = new URL(value, baseUrl)
  }
} catch (error) {
  handleError(error)
}
`,
      errors: [{ messageId: 'preferUrlCanParse' }],
    },
  ],
  valid: [
    {
      code: `
if (!URL.canParse(value)) {
  throw new Error('Enter a valid GitHub pull request URL')
}
const url = new URL(value)
`,
    },
    {
      code: `
const url = new URL(value)
`,
    },
    {
      code: `
try {
  parseUrl(value)
} catch {
  const fallbackUrl = new URL(fallbackValue)
}
`,
    },
    {
      code: `
try {
  const url = new URL(value)
} finally {
  cleanup()
}
`,
    },
    {
      code: `
try {
  const parsedUrl = new Url(value)
} catch {
  handleInvalidUrl()
}
`,
    },
  ],
})
