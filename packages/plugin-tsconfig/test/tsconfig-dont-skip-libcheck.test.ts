import * as rule from '../src/tsconfig-no-unchecked-side-effect-imports.ts'
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

ruleTester.run('dont-skip-libcheck', rule, {
  valid: [
    {
      code: '{"compilerOptions": { "skipLibCheck": false }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          messageId: 'dontSkipLibCheck',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: '{"compilerOptions": { "skipLibCheck": true }}',
      errors: [
        {
          messageId: 'dontSkipLibCheck',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 53,
        },
      ],
    },
  ],
})
