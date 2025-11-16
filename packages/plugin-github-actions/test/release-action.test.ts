import { RuleTester } from 'eslint'
import parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/release-action.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2020,
  },
})

ruleTester.run('releaseAction', rule, {
  valid: [
    {
      code: `jobs:
  create-release:
    name: create-release
    steps:
      - name: Create GitHub release
        id: release
        uses: softprops/action-gh-release@v2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: \${{ env.RG_VERSION }}
          name: \${{ env.RG_VERSION }}
          draft: true`,
    },
  ],
  invalid: [
    {
      code: `jobs:
  create-release:
    name: create-release
    steps:
      - name: Create GitHub release
        id: release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: \${{ env.RG_VERSION }}
          release_name: \${{ env.RG_VERSION }}
          draft: true`,
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
