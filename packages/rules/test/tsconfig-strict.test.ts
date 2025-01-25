import * as rule from '../src/tsconfig-strict.ts'
import json from '@eslint/json'
import { RuleTester } from 'eslint'

const ruleTester = new RuleTester({
  plugins: {
    json,
  },
  language: 'json/json',
})

ruleTester.run('strict', rule, {
  valid: [
    {
      code: '{"compilerOptions": { "strict": true }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          messageId: 'strict',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: '{"compilerOptions": { "strict": false }}',
      errors: [
        {
          messageId: 'strict',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 57,
        },
      ],
    },
  ],
})
