import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/tsconfig-assume-changes-only-affect-direct-dependencies.ts'

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

ruleTester.run('assume-changes-only-affect-direct-dependencies', rule, {
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          column: 2,
          endColumn: 19,
          endLine: 1,
          line: 1,
          messageId: 'assumeChangesOnlyAffectDirectDependencies',
        },
      ],
    },
    {
      code: '{"compilerOptions": { "assumeChangesOnlyAffectDirectDependencies": false }}',
      errors: [
        {
          column: 23,
          endColumn: 66,
          endLine: 1,
          line: 1,
          messageId: 'assumeChangesOnlyAffectDirectDependencies',
        },
      ],
    },
  ],
  valid: [
    {
      code: '{"compilerOptions": { "assumeChangesOnlyAffectDirectDependencies": true }}',
      // @ts-ignore
      language: 'json/json5',
    },
  ],
})
