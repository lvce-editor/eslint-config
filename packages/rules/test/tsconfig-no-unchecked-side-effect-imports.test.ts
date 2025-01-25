import * as rule from '../src/tsconfig-no-unchecked-side-effect-imports.ts'
import json from '@eslint/json'
import { RuleTester } from 'eslint'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  plugins: {
    json,
  },
  language: 'json/json',
})

ruleTester.run('no-unchecked-side-effect-imports', rule, {
  valid: [
    {
      code: '{"compilerOptions": { "noUncheckedSideEffectImports": true }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          messageId: 'noUncheckedSideEffectImport',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: '{"compilerOptions": { "noUncheckedSideEffectImports": false }}',
      errors: [
        {
          messageId: 'noUncheckedSideEffectImport',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 53,
        },
      ],
    },
  ],
})
