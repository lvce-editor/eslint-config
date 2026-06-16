import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/tsconfig-strict.ts'

const ruleTester = new RuleTester({
  language: 'json/json',
  plugins: {
    // @ts-ignore
    json,
  },
})

ruleTester.run('strict', rule, {
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          column: 2,
          endColumn: 19,
          endLine: 1,
          line: 1,
          messageId: 'strict',
        },
      ],
    },
    {
      code: '{"compilerOptions": { "strict": false }}',
      errors: [
        {
          column: 23,
          endColumn: 31,
          endLine: 1,
          line: 1,
          messageId: 'strict',
        },
      ],
    },
  ],
  valid: [
    {
      code: '{"compilerOptions": { "strict": true }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
})
