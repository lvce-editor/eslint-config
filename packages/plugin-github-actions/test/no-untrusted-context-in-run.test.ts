import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/no-untrusted-context-in-run.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('noUntrustedContextInRun', rule, {
  valid: [
    {
      code: `
jobs:
  ci:
    steps:
      - run: echo "$PR_TITLE"
        env:
          PR_TITLE: \${{ github.event.pull_request.title }}`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  ci:
    steps:
      - run: echo "\${{ github.event.pull_request.title }}"`,
      errors: [
        {
          messageId: 'untrustedContextInRun',
        },
      ],
    },
  ],
})
