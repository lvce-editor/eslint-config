import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/rules/non-empty-languages.ts'

const ruleTester = new RuleTester({
  language: 'json/json',
  plugins: {
    // @ts-ignore
    json,
  },
})

ruleTester.run('non-empty-languages', rule, {
  invalid: [
    {
      code: '{"languages": []}',
      errors: [{ messageId: 'emptyLanguages' }],
    },
  ],
  valid: [
    {
      code: '{}',
    },
    {
      code: '{"languages": ["javascript"]}',
    },
    {
      code: '{"languages": null}',
    },
    {
      code: '{"languages": {}}',
    },
    {
      code: '{"contributes": {"languages": []}}',
    },
    {
      code: '{"other": []}',
    },
  ],
})
