import * as rule from '../src/tsconfig-exact-optional-property-types.ts'
import json from '@eslint/json'
import { RuleTester } from 'eslint'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  plugins: {
    // @ts-ignore
    json,
  },
  language: 'json/json',
})

ruleTester.run('exact-optional-property-types', rule, {
  valid: [
    {
      code: '{"compilerOptions": { "exactOptionalPropertyTypes": true }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          messageId: 'exactOptionalPropertyTypes',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: '{"compilerOptions": { "exactOptionalPropertyTypes": false }}',
      errors: [
        {
          messageId: 'exactOptionalPropertyTypes',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 51,
        },
      ],
    },
  ],
})
