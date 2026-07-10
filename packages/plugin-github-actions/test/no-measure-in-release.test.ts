import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/no-measure-in-release.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('noMeasureInRelease', rule, {
  invalid: [
    {
      code: `
jobs:
  build-release:
    runs-on: ubuntu-24.04
    steps:
      - name: measure
        working-directory: ./packages/memory
        run: npm run measure`,
      errors: [
        {
          column: 14,
          endColumn: 29,
          endLine: 8,
          line: 8,
          messageId: 'noMeasureInRelease',
        },
      ],
      filename: '/test/.github/workflows/release.yml',
    },
    {
      code: `
jobs:
  build-release:
    runs-on: windows-2025
    steps:
      - run: cd packages/memory && npm run measure:visible`,
      errors: [
        {
          messageId: 'noMeasureInRelease',
        },
      ],
      filename: 'C:\\test\\.github\\workflows\\release.yaml',
    },
  ],
  valid: [
    {
      code: `
jobs:
  build-release:
    runs-on: ubuntu-24.04
    steps:
      - run: npm run lint
      - run: npm test
      - run: npm run type-check`,
      filename: '/test/.github/workflows/release.yml',
    },
    {
      code: `
jobs:
  pr:
    runs-on: ubuntu-24.04
    steps:
      - run: npm run measure`,
      filename: '/test/.github/workflows/pr.yml',
    },
    {
      code: `
jobs:
  build-release:
    runs-on: ubuntu-24.04
    steps:
      - run: npm run measurement-report`,
      filename: '/test/.github/workflows/release.yml',
    },
  ],
})
