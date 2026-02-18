import { RuleTester } from 'eslint'
import * as rule from '../src/rules/hoist-regex.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('hoist-regex', rule, {
  valid: [
    {
      code: `
const wordRegex = /word/g

export const testWord = (value) => {
  return wordRegex.test(value)
}
`,
    },
    {
      code: `
const matcher = new RegExp('^abc$')

function matches(value) {
  return matcher.test(value)
}
`,
    },
    {
      code: `
function matchesAvatar(escapedUserId, key) {
  const avatarKeyRegex = new RegExp(\`^avatar:user:\${escapedUserId}(?::|$)\`)
  return avatarKeyRegex.test(key)
}
`,
    },
  ],
  invalid: [
    {
      code: `
export const matches = (value) => {
  return /abc/.test(value)
}
`,
      errors: [
        {
          messageId: 'hoistRegex',
          line: 3,
          column: 10,
          endLine: 3,
          endColumn: 15,
        },
      ],
    },
    {
      code: `
function matches(value) {
  const matcher = new RegExp('abc')
  return matcher.test(value)
}
`,
      errors: [
        {
          messageId: 'hoistRegex',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 36,
        },
      ],
    },
    {
      code: `
function matches(value) {
  const matcher = RegExp('abc')
  return matcher.test(value)
}
`,
      errors: [
        {
          messageId: 'hoistRegex',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 32,
        },
      ],
    },
  ],
})
