import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-import-meta-resolve.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('prefer-import-meta-resolve', rule, {
  invalid: [
    {
      code: `
const uri = new URL('../fixtures/sample', import.meta.url).toString()
`,
      errors: [{ messageId: 'preferImportMetaResolve' }],
    },
    {
      code: `
const uri = new Url('../fixtures/sample', import.meta.url).toString()
`,
      errors: [{ messageId: 'preferImportMetaResolve' }],
    },
  ],
  valid: [
    {
      code: `
const uri = import.meta.resolve('../fixtures/sample')
`,
    },
    {
      code: `
const uri = new URL('../fixtures/sample', import.meta.url)
`,
    },
    {
      code: `
const uri = new URL('../fixtures/sample', other.url).toString()
`,
    },
  ],
})
