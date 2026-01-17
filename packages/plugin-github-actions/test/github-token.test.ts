import { RuleTester } from 'eslint'
import { parseYAML } from 'yaml-eslint-parser'
import * as rule from '../src/rules/github-token.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: { parse: parseYAML },
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
          messageId: 'unsupportedGithubToken',
          column: 11,
          endColumn: 28,
          endLine: 10,
          line: 10,
        },
      ],
    },
  ],
})
