import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/rules/docker-in-docker.ts'

// cspell:ignore moby

const ruleTester = new RuleTester({
  language: 'json/jsonc',
  languageOptions: {
    allowTrailingCommas: true,
  },
  plugins: {
    // @ts-ignore
    json,
  },
})

ruleTester.run('docker-in-docker', rule, {
  invalid: [
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker":{"moby":false}}}',
      errors: [{ messageId: 'invalidVersion' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:1":{"moby":false}}}',
      errors: [{ messageId: 'invalidVersion' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:2":{"moby":false}}}',
      errors: [{ messageId: 'invalidVersion' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:3":{"moby":false}}}',
      errors: [{ messageId: 'invalidVersion' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:5":{"moby":false}}}',
      errors: [{ messageId: 'invalidVersion' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:latest":{"moby":false}}}',
      errors: [{ messageId: 'invalidVersion' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4.0.0":{"moby":false}}}',
      errors: [{ messageId: 'invalidVersion' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker@sha256:abc":{"moby":false}}}',
      errors: [{ messageId: 'invalidVersion' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":{}}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":{"moby":true}}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":{"moby":"false"}}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":{"moby":0}}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":{"moby":null}}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":{"moby":{}}}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":{"moby":[]}}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":null}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":[]}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":true}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":false}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":"false"}}',
      errors: [{ messageId: 'mobyMustBeFalse' }],
    },
    {
      code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:3":{}}}',
      errors: [{ messageId: 'invalidVersion' }, { messageId: 'mobyMustBeFalse' }],
    },
  ],
  valid: [
    { code: '{}' },
    { code: 'null' },
    { code: '{"features": null}' },
    { code: '{"features": []}' },
    { code: '{"features": {}}' },
    { code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":{"moby":false}}}' },
    { code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker:4":{"moby":false,"version":"latest"}}}' },
    { code: '{"features":{"ghcr.io/devcontainers/features/docker-outside-of-docker:1":{}}}' },
    { code: '{"features":{"ghcr.io/devcontainers/features/docker-in-docker-custom:1":{}}}' },
    { code: '{"features":{"ghcr.io/other/features/docker-in-docker:1":{}}}' },
    { code: '{"customizations":{"features":{"ghcr.io/devcontainers/features/docker-in-docker:3":{}}}}' },
    {
      code: `{
        // Keep Docker CE enabled.
        "features": {
          "ghcr.io/devcontainers/features/docker-in-docker:4": { "moby": false, },
        },
      }`,
    },
  ],
})
