import * as rule from '../src/tsconfig-module-resolution.ts'
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

ruleTester.run('module-resolution', rule, {
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
  invalid: [
    {
      code: '{"compilerOptions": { "moduleResolution": "classic" }}',
      errors: [
        {
          messageId: 'moduleResolution',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 41,
        },
      ],
    },
    {
      code: '{"compilerOptions": { "moduleResolution": true }}',
      errors: [
        {
          messageId: 'moduleResolution',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 41,
        },
      ],
    },
  ],
})
