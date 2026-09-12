import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-restricted-dependencies.ts'

const ruleTester = new RuleTester({
  language: 'json/json',
  plugins: {
    // @ts-ignore
    json,
  },
})

ruleTester.run('no-restricted-dependencies', rule, {
  invalid: [
    ...['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'].map((section) => ({
      code: JSON.stringify({ [section]: { typescript: '^7.0.2' } }),
      errors: [{ messageId: 'unsupported' }],
    })),
    ...['5.9.3', '*', 'latest', '>=6', '^6 || ^7', '7.0.0-beta.1', 'npm:typescript@6.0.3', 'file:../typescript', ''].map((version) => ({
      code: JSON.stringify({ devDependencies: { typescript: version } }),
      errors: [{ messageId: 'unsupported' }],
    })),
    ...['10.10.0', '^10.8.1', '>=10', '11.0.0'].map((version) => ({
      code: JSON.stringify({ devDependencies: { eslint: version } }),
      errors: [{ messageId: 'unsupported' }],
    })),
    {
      code: '{"dependencies":{"blocked-package":"1.0.0"}}',
      options: [{ restrictions: { 'blocked-package': false } }],
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: '{"dependencies":{"some-package":"^2.0.0"}}',
      options: [{ restrictions: { 'some-package': '^1.0.0' } }],
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '{"devDependencies":{"typescript":6}}',
      errors: [{ messageId: 'unsupported' }],
    },
  ],
  valid: [
    '{}',
    '[]',
    '{"dependencies":null}',
    '{"custom":{"typescript":"7.0.2"}}',
    '{"dependencies":{"other":"latest","constructor":"1.0.0"}}',
    ...['6.0.3', '^6.0.3', '~6.0.3', '6', '6.x', '>=6.0.0 <7.0.0-0', '6.0.0 - 6.9.0'].map((version) => ({
      code: JSON.stringify({ devDependencies: { typescript: version } }),
    })),
    '{"devDependencies":{"eslint":"10.8.1"}}',
    '{"peerDependencies":{"eslint":">=10.0.0 <10.10.0-0"}}',
    {
      code: '{"dependencies":{"typescript":"7.0.2"}}',
      options: [{ restrictions: { typescript: '^7.0.0' } }],
    },
  ],
})
