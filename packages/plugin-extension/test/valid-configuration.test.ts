import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/rules/valid-configuration.ts'

const ruleTester = new RuleTester({
  language: 'json/json',
  plugins: {
    // @ts-ignore
    json,
  },
})

ruleTester.run('valid-configuration', rule, {
  invalid: [
    {
      code: '{"configuration": []}',
      errors: [{ messageId: 'invalidConfiguration' }],
    },
    {
      code: '{"configuration": {"sample.theme": null}}',
      errors: [{ messageId: 'invalidSetting' }],
    },
    {
      // cspell:ignore strig
      code: '{"configuration": {"sample.theme": {"type": "strig"}}}',
      errors: [{ column: 45, messageId: 'invalidType' }],
    },
    {
      code: '{"configuration": {"sample.theme": {"type": 1}}}',
      errors: [{ messageId: 'invalidType' }],
    },
    {
      code: '{"configuration": {"sample.theme": {"type": []}}}',
      errors: [{ messageId: 'invalidType' }],
    },
    {
      code: '{"configuration": {"sample.theme": {"type": ["string", "string"]}}}',
      errors: [{ messageId: 'invalidType' }],
    },
    {
      code: '{"configuration": {"sample.theme": {"type": ["string", false]}}}',
      errors: [{ messageId: 'invalidType' }],
    },
  ],
  valid: [
    {
      code: '{"languages": [{"configuration": "languageConfiguration.json"}]}',
    },
    {
      code: '{"configuration": {}}',
    },
    {
      code: '{"configuration": {"sample.font": {"type": ["string", "null"], "default": null}}}',
    },
    {
      code: '{"configuration": {"sample.theme": {"enum": ["light", "dark"]}, "sample.enabled": {"type": "boolean", "default": true}}}',
    },
  ],
})
