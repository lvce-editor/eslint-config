import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/rules/content-security-policy.ts'

const ruleTester = new RuleTester({
  language: 'json/json',
  plugins: {
    // @ts-ignore
    json,
  },
})

ruleTester.run('content-security-policy', rule, {
  invalid: [
    {
      code: '{"browser": "dist/main.js"}',
      errors: [{ messageId: 'missingContentSecurityPolicy' }],
    },
    {
      code: '{"main": "dist/main.js"}',
      errors: [{ messageId: 'missingContentSecurityPolicy' }],
    },
    {
      code: '{"browser": "dist/main.js", "contentSecurityPolicy": []}',
      errors: [{ messageId: 'insecureContentSecurityPolicy' }],
    },
    {
      code: '{"browser": "dist/main.js", "contentSecurityPolicy": ["script-src \'self\'", "default-src \'none\'"]}',
      errors: [{ messageId: 'insecureContentSecurityPolicy' }],
    },
    {
      code: '{"browser": "dist/main.js", "contentSecurityPolicy": null}',
      errors: [{ messageId: 'invalidContentSecurityPolicy' }],
    },
    {
      code: '{"browser": "dist/main.js", "contentSecurityPolicy": {"default-src": "none"}}',
      errors: [{ messageId: 'invalidContentSecurityPolicy' }],
    },
    {
      code: '{"browser": "dist/main.js", "contentSecurityPolicy": ["default-src \'none\'", null]}',
      errors: [{ messageId: 'invalidContentSecurityPolicy' }],
    },
    {
      code: '{"browser": "dist/main.js", "contentSecurityPolicy": ["default-src \'none\'", {}]}',
      errors: [{ messageId: 'invalidContentSecurityPolicy' }],
    },
  ],
  valid: [
    {
      code: '{}',
    },
    {
      code: '{"name": "theme", "contentSecurityPolicy": ["default-src \'none\'"]}',
    },
    {
      code: '{"browser": "dist/main.js", "contentSecurityPolicy": ["default-src \'none\'", "connect-src https://nodejs.org", "script-src \'self\'"]}',
    },
    {
      code: '{"main": "dist/main.js", "contentSecurityPolicy": ["default-src \'none\'"]}',
    },
  ],
})
