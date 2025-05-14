import * as rule from '../src/tsconfig-force-consistent-casing-in-file-names.ts'
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

ruleTester.run('force-consistent-casing-in-file-names', rule, {
  valid: [
    {
      code: '{"compilerOptions": { "forceConsistentCasingInFileNames": true }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          messageId: 'forceConsistentCasingInFileNames',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: '{"compilerOptions": { "forceConsistentCasingInFileNames": false }}',
      errors: [
        {
          messageId: 'forceConsistentCasingInFileNames',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 57,
        },
      ],
    },
  ],
})
