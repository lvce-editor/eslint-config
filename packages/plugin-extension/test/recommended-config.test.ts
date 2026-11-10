import { Linter } from 'eslint'
import { deepEqual, equal, throws } from 'node:assert/strict'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'
import defaultConfig, { recommendedExtension } from '../../plugin/index.js'

void test('exported extension preset diagnoses no-op optional methods using actual API declarations', () => {
  const linter = new Linter()
  const filename = fileURLToPath(new URL('../fixtures/input.ts', import.meta.url))
  const config = [
    {
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          project: './tsconfig.json',
          tsconfigRootDir: fileURLToPath(new URL('../fixtures/', import.meta.url)),
        },
      },
    },
    ...recommendedExtension,
  ]
  const code = `import type { CompletionProvider } from '@lvce-editor/api';
    const provider: CompletionProvider = { id: 'test', languageId: 'xyz', provideCompletions() { return [] },
      resolveCompletionItem() { return undefined } }`
  const messages = linter.verify(code, config, { filename })
  equal(messages.length, 1)
  equal(messages[0].ruleId, 'extension/no-empty-optional-provider-method')
  deepEqual(linter.verify(code.replace('resolveCompletionItem() { return undefined }', ''), config, { filename }), [])
})

void test('extension preset explains missing type information', () => {
  const linter = new Linter()
  throws(() => linter.verify('const provider = {}', [...recommendedExtension], { filename: 'main.ts' }), /requires TypeScript type information/)
})

void test('default configuration includes extension provider checks', () => {
  equal(
    defaultConfig.some((config: any) => config.rules?.['extension/no-empty-optional-provider-method'] === 'error'),
    true,
  )
})
