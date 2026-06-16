import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/tsconfig-dont-skip-libcheck.ts'

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

ruleTester.run('dont-skip-libcheck', rule, {
  invalid: [
    {
      code: '{"compilerOptions": { "skipLibCheck": true }}',
      errors: [
        {
          column: 23,
          endColumn: 37,
          endLine: 1,
          line: 1,
          messageId: 'skipLibCheck',
        },
      ],
    },
  ],
  valid: [
    {
      code: '{"compilerOptions": { "skipLibCheck": false }}',
      // @ts-ignore
      language: 'json/json5',
    },
    {
      code: '{"compilerOptions": { }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
})
