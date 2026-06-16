import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/tsconfig-exact-optional-property-types.ts'

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

ruleTester.run('exact-optional-property-types', rule, {
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          column: 2,
          endColumn: 19,
          endLine: 1,
          line: 1,
          messageId: 'exactOptionalPropertyTypes',
        },
      ],
    },
    {
      code: '{"compilerOptions": { "exactOptionalPropertyTypes": false }}',
      errors: [
        {
          column: 23,
          endColumn: 51,
          endLine: 1,
          line: 1,
          messageId: 'exactOptionalPropertyTypes',
        },
      ],
    },
  ],
  valid: [
    {
      code: '{"compilerOptions": { "exactOptionalPropertyTypes": true }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
})
