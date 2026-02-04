import * as rule from '../src/tsconfig-dont-skip-libcheck.ts'
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
    {
      code: '{"compilerOptions": { }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
  invalid: [
    {
      code: '{"compilerOptions": { "skipLibCheck": true }}',
      errors: [
        {
          messageId: 'skipLibCheck',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 53,
        },
      ],
    },
  ],
})
