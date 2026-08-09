import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-inline-import-meta-resolve-in-open-uri.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-inline-import-meta-resolve-in-open-uri', rule, {
  invalid: [
    {
      code: `
export const test = async ({ Main }) => {
  await Main.openUri(import.meta.resolve('../sample-files/file.txt'))
}
`,
      errors: [{ messageId: 'noInlineImportMetaResolveInOpenUri' }],
    },
  ],
  valid: [
    {
      code: `
export const test = async ({ Main }) => {
  const uri = import.meta.resolve('../sample-files/file.txt')
  await Main.openUri(uri)
}
`,
    },
    {
      code: `
export const test = async ({ Main }) => {
  await Main.openUri(resolveUri('../sample-files/file.txt'))
}
`,
    },
    {
      code: `
export const test = async () => {
  await Other.openUri(import.meta.resolve('../sample-files/file.txt'))
}
`,
    },
  ],
})
