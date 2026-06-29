import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/rules/require-desktop-lite-feature.ts'

const ruleTester = new RuleTester({
  language: 'json/json',
  plugins: {
    // @ts-ignore
    json,
  },
})

ruleTester.run('require-desktop-lite-feature', rule, {
  invalid: [
    {
      code: '{}',
      errors: [
        {
          messageId: 'missingFeatures',
        },
      ],
    },
    {
      code: '{"features": []}',
      errors: [
        {
          messageId: 'featuresMustBeObject',
        },
      ],
    },
    {
      code: '{"features": {}}',
      errors: [
        {
          messageId: 'missingDesktopLiteFeature',
        },
      ],
    },
  ],
  valid: [
    {
      code: '{"features": { "ghcr.io/devcontainers/features/desktop-lite:1": {} }}',
    },
  ],
})
