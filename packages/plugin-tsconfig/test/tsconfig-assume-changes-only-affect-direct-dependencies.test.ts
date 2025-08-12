import * as rule from '../src/tsconfig-assume-changes-only-affect-direct-dependencies.ts'
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

ruleTester.run('assume-changes-only-affect-direct-dependencies', rule, {
  valid: [
    {
      code: '{"compilerOptions": { "assumeChangesOnlyAffectDirectDependencies": true }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          messageId: 'assumeChangesOnlyAffectDirectDependencies',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: '{"compilerOptions": { "assumeChangesOnlyAffectDirectDependencies": false }}',
      errors: [
        {
          messageId: 'assumeChangesOnlyAffectDirectDependencies',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 66,
        },
      ],
    },
  ],
})
