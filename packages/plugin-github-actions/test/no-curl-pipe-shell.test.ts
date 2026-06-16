import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/no-curl-pipe-shell.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('noCurlPipeShell', rule, {
  valid: [
    {
      code: `
jobs:
  ci:
    steps:
      - run: curl --fail --location https://example.com/install.sh --output install.sh`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  ci:
    steps:
      - run: curl https://example.com/install.sh | bash`,
      errors: [
        {
          messageId: 'curlPipeShell',
        },
      ],
    },
  ],
})
