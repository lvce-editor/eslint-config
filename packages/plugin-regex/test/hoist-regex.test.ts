import { RuleTester } from 'eslint'
import * as rule from '../src/rules/hoist-regex.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('hoist-regex', rule, {
  invalid: [
    {
      code: `
export const matches = (value) => {
  return /abc/.test(value)
}
`,
      errors: [
        {
          column: 10,
          endColumn: 15,
          endLine: 3,
          line: 3,
          messageId: 'hoistRegex',
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
          column: 19,
          endColumn: 36,
          endLine: 3,
          line: 3,
          messageId: 'hoistRegex',
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
          column: 19,
          endColumn: 32,
          endLine: 3,
          line: 3,
          messageId: 'hoistRegex',
        },
      ],
    },
  ],
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
})
