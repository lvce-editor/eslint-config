import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/no-secrets-in-run-command.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('noSecretsInRunCommand', rule, {
  valid: [
    {
      code: `
jobs:
  ci:
    steps:
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  ci:
    steps:
      - run: npm publish --token \${{ secrets.NPM_TOKEN }}`,
      errors: [
        {
          messageId: 'secretInRunCommand',
        },
      ],
    },
  ],
})
