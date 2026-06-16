import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/github-token.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('githubToken', rule, {
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
          column: 11,
          endColumn: 28,
          endLine: 10,
          line: 10,
          messageId: 'unsupportedGithubToken',
        },
      ],
    },
  ],
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
})
