import { RuleTester } from 'eslint'
import tseslint from 'typescript-eslint'
import * as rule from '../src/rules/no-imports.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser: tseslint.parser,
    sourceType: 'module',
  },
})

ruleTester.run('no-imports', rule, {
  invalid: [
    {
      code: `import { helper } from './helper.ts'`,
      errors: [{ messageId: 'noImports' }],
    },
    {
      code: `import type { Helper } from './helper.ts'`,
      errors: [{ messageId: 'noImports' }],
    },
    {
      code: `import { test } from '@lvce-editor/test-with-playwright'`,
      errors: [{ messageId: 'noImports' }],
    },
    {
      code: `import { type Test, test } from '@lvce-editor/test-with-playwright'`,
      errors: [{ messageId: 'noImports' }],
    },
    {
      code: `import '@lvce-editor/test-with-playwright'`,
      errors: [{ messageId: 'noImports' }],
    },
  ],
  valid: [
    {
      code: `export const test = async () => {}`,
    },
    {
      code: `import type { Test } from '@lvce-editor/test-with-playwright'`,
    },
    {
      code: `import { type Test } from '@lvce-editor/test-with-playwright'`,
    },
    {
      code: `import type * as PlaywrightTypes from '@lvce-editor/test-with-playwright'`,
    },
  ],
})
