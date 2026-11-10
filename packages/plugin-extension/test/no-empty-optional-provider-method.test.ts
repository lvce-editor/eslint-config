import { RuleTester } from 'eslint'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'
import * as rule from '../src/rules/no-empty-optional-provider-method.ts'

const fixtureRoot = fileURLToPath(new URL('../fixtures/', import.meta.url))
const filename = fileURLToPath(new URL('../fixtures/input.ts', import.meta.url))
const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: fixtureRoot,
    },
  },
})

const provider = (method: string): string => `
import type { CompletionProvider as Provider } from '@lvce-editor/api'
const provider: Provider = {
  id: 'test',
  languageId: 'xyz',
  provideCompletions() { return [] },
  ${method}
}
`

ruleTester.run('no-empty-optional-provider-method', rule, {
  invalid: [
    ...[
      'resolveCompletionItem(_textDocument, _offset, _name, _completionItem) { return undefined }',
      'async resolveCompletionItem() { return undefined }',
      'resolveCompletionItem() {}',
      'resolveCompletionItem() { return }',
      'resolveCompletionItem: () => undefined',
      'resolveCompletionItem: async () => undefined',
      'resolveCompletionItem: function () { return void 0 }',
      "['resolveCompletionItem']() { return undefined }",
    ].map((method) => ({
      code: provider(method),
      errors: [{ data: { name: 'resolveCompletionItem' }, messageId: 'omitMethod' }],
      filename,
    })),
    {
      code: `import { registerCompletionProvider } from '@lvce-editor/api'; registerCompletionProvider({
        id: 'test', languageId: 'xyz', provideCompletions() { return [] }, resolveCompletionItem() { return undefined }
      })`,
      errors: [{ messageId: 'omitMethod' }],
      filename,
    },
    {
      code: `import type * as Api from '@lvce-editor/api'; const provider = {
        id: 'test', languageId: 'xyz', provideCompletions() { return [] }, resolveCompletionItem: () => undefined
      } satisfies Api.CompletionProvider`,
      errors: [{ messageId: 'omitMethod' }],
      filename,
    },
  ],
  valid: [
    {
      code: `import type { FileSystemProvider } from '@lvce-editor/api';
        const provider: FileSystemProvider = { id: 'test', readFile() { return '' }, mkdir() {} }`,
      filename,
    },
    {
      code: `import type { CompletionProvider } from '@lvce-editor/api';
        const provider: Partial<CompletionProvider> = { provideCompletions() { return undefined } }`,
      filename,
    },
    ...[
      '',
      'resolveCompletionItem(_document, _offset, _name, item) { return item }',
      'resolveCompletionItem() { log(); return undefined }',
      'resolveCompletionItem() { throw new Error() }',
      'resolveCompletionItem() { return void log() }',
      'resolveCompletionItem() { return null }',
      'resolveCompletionItem(undefined) { return undefined }',
      'resolveCompletionItem(item = log()) { return undefined }',
      'resolveCompletionItem({ item }) { return undefined }',
      '*resolveCompletionItem() {}',
      'resolveCompletionItem() { if (condition) return item; return undefined }',
      'resolveCompletionItem() { function nested() { return undefined }; return item }',
    ].map((method) => ({ code: provider(method), filename })),
    {
      code: `import type { CompletionProvider } from '@lvce-editor/api';
        const provider: CompletionProvider = { id: 'test', languageId: 'xyz', provideCompletions() { return undefined } }`,
      filename,
    },
    {
      code: 'const unrelated = { resolveCompletionItem() { return undefined } }',
      filename,
    },
    {
      code: `interface CompletionProvider { resolveCompletionItem?(): undefined }
        const unrelated: CompletionProvider = { resolveCompletionItem() { return undefined } }`,
      filename,
    },
    {
      code: `import type { CompletionProvider } from '@lvce-editor/api';
        interface RequiredProvider extends CompletionProvider { resolveCompletionItem(): undefined }
        const provider: RequiredProvider = { id: 'test', languageId: 'xyz', provideCompletions() { return [] },
          resolveCompletionItem() { return undefined } }`,
      filename,
    },
    {
      code: `import type { CompletionProvider } from '@lvce-editor/api';
        const provider = { id: 'test', languageId: 'xyz', provideCompletions() { return [] },
          resolveCompletionItem() { return undefined } }`,
      filename,
    },
    {
      code: `import type { CompletionProvider } from '@lvce-editor/api';
        function create(undefined) { const provider: CompletionProvider = {
          id: 'test', languageId: 'xyz', provideCompletions() { return [] }, resolveCompletionItem: () => undefined
        } }`,
      filename,
    },
  ],
})
