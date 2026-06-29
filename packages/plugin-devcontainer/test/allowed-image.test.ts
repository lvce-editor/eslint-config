import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/rules/allowed-image.ts'

const ruleTester = new RuleTester({
  language: 'json/json',
  plugins: {
    // @ts-ignore
    json,
  },
})

ruleTester.run('allowed-image', rule, {
  invalid: [
    {
      code: '{}',
      errors: [
        {
          messageId: 'missingImage',
        },
      ],
    },
    {
      code: '{"image": 1}',
      errors: [
        {
          messageId: 'imageMustBeString',
        },
      ],
    },
    {
      code: '{"image": "node:24"}',
      errors: [
        {
          messageId: 'unsupportedImage',
        },
      ],
    },
  ],
  valid: [
    {
      code: '{"image": "mcr.microsoft.com/devcontainers/javascript-node:24"}',
    },
    {
      code: '{"image": "mcr.microsoft.com/devcontainers/typescript-node:24"}',
      options: [
        {
          allowedImages: ['mcr.microsoft.com/devcontainers/typescript-node:24'],
        },
      ],
    },
  ],
})
