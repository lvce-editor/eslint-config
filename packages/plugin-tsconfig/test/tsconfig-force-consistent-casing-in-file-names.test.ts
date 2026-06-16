import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/tsconfig-force-consistent-casing-in-file-names.ts'

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

ruleTester.run('force-consistent-casing-in-file-names', rule, {
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          column: 2,
          endColumn: 19,
          endLine: 1,
          line: 1,
          messageId: 'forceConsistentCasingInFileNames',
        },
      ],
    },
    {
      code: '{"compilerOptions": { "forceConsistentCasingInFileNames": false }}',
      errors: [
        {
          column: 23,
          endColumn: 57,
          endLine: 1,
          line: 1,
          messageId: 'forceConsistentCasingInFileNames',
        },
      ],
    },
  ],
  valid: [
    {
      code: '{"compilerOptions": { "forceConsistentCasingInFileNames": true }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
})
