import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/release-action.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('releaseAction', rule, {
  invalid: [
    {
      code: `
jobs:
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
          column: 9,
          endColumn: 40,
          endLine: 8,
          line: 8,
          messageId: 'unsupportedReleaseAction',
        },
      ],
      output: `
jobs:
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
  valid: [
    {
      code: `
jobs:
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
})
