import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-filesystem-set-files.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('prefer-filesystem-set-files', rule, {
  invalid: [
    {
      code: `
export const test = async ({ FileSystem }) => {
  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')
}
`,
      errors: [{ messageId: 'preferFileSystemSetFiles' }],
    },
    {
      code: `
export const test = async ({ FileSystem }) => {
  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')
  await FileSystem.writeFile(file3, 'three')
}
`,
      errors: [{ messageId: 'preferFileSystemSetFiles' }, { messageId: 'preferFileSystemSetFiles' }],
    },
  ],
  valid: [
    {
      code: `
export const test = async ({ FileSystem }) => {
  await FileSystem.setFiles([
    { path: file1, content: 'one' },
    { path: file2, content: 'two' },
  ])
}
`,
    },
    {
      code: `
export const test = async ({ FileSystem, Main }) => {
  await FileSystem.writeFile(file1, 'one')
  await Main.openUri(file1)
  await FileSystem.writeFile(file2, 'two')
}
`,
    },
    {
      code: `
export const test = async ({ FileSystem }) => {
  await FileSystem.writeFile(file1, 'one')
  await Other.writeFile(file2, 'two')
}
`,
    },
    {
      code: `
export const test = async ({ fileSystem }) => {
  await fileSystem.writeFile(file1, 'one')
  await fileSystem.writeFile(file2, 'two')
}
`,
    },
  ],
})
