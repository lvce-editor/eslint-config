import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/tsconfig-no-unchecked-side-effect-imports.ts'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  language: 'json/json',
  plugins: {
    // @ts-ignore
    json,
  },
})

ruleTester.run('no-unchecked-side-effect-imports', rule, {
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          column: 2,
          endColumn: 19,
          endLine: 1,
          line: 1,
          messageId: 'noUncheckedSideEffectImports',
        },
      ],
    },
    {
      code: '{"compilerOptions": { "noUncheckedSideEffectImports": false }}',
      errors: [
        {
          column: 23,
          endColumn: 53,
          endLine: 1,
          line: 1,
          messageId: 'noUncheckedSideEffectImports',
        },
      ],
    },
  ],
  valid: [
    {
      code: '{"compilerOptions": { "noUncheckedSideEffectImports": true }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
})
