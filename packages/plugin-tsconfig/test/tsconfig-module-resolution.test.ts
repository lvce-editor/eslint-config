import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/tsconfig-module-resolution.ts'

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

ruleTester.run('module-resolution', rule, {
  invalid: [
    {
      code: '{"compilerOptions": { "moduleResolution": "classic" }}',
      errors: [
        {
          column: 23,
          endColumn: 41,
          endLine: 1,
          line: 1,
          messageId: 'moduleResolution',
        },
      ],
    },
    {
      code: '{"compilerOptions": { "moduleResolution": true }}',
      errors: [
        {
          column: 23,
          endColumn: 41,
          endLine: 1,
          line: 1,
          messageId: 'moduleResolution',
        },
      ],
    },
  ],
  valid: [
    {
      code: '{"compilerOptions": { "moduleResolution": "bundle" }}',
      // @ts-ignore
      language: 'json/json5',
    },
    {
      code: '{"compilerOptions": { "moduleResolution": "NodeNext" }}',
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
