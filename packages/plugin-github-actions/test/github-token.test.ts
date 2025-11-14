import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/github-token.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('githubToken', rule, {
  valid: [
    {
      code: `
jobs:
  publish-release:
    runs-on: ubuntu-24.04
    steps:
      - name: Create GitHub release
        id: release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,
    },
  ],
  invalid: [
    {
      code: `
jobs:
  publish-release:
    runs-on: ubuntu-24.04
    steps:
      - name: Create GitHub release
        id: release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: 123`,
      errors: [
        {
          messageId: 'invalidGithubToken',
          column: 11,
          endColumn: 33,
          endLine: 8,
          line: 8,
        },
      ],
    },
  ],
})
