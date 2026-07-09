import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/no-e2e-in-release.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('noE2eInRelease', rule, {
  invalid: [
    {
      code: `
jobs:
  build-release:
    runs-on: ubuntu-24.04
    steps:
      - name: e2e
        working-directory: ./packages/e2e
        run: npm run e2e:headless`,
      errors: [
        {
          column: 14,
          endColumn: 34,
          endLine: 8,
          line: 8,
          messageId: 'noE2eInRelease',
        },
      ],
      filename: '/test/.github/workflows/release.yml',
    },
    {
      code: `
jobs:
  build-release:
    runs-on: ubuntu-24.04
    steps:
      - run: cd packages/e2e && npm run e2e`,
      errors: [
        {
          messageId: 'noE2eInRelease',
        },
      ],
      filename: '/test/.github/workflows/release.yaml',
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
      - run: npm run e2e:headless`,
      filename: '/test/.github/workflows/pr.yml',
    },
    {
      code: `
jobs:
  build-release:
    runs-on: ubuntu-24.04
    steps:
      - name: install playwright dependencies
        working-directory: ./packages/e2e
        run: npx playwright install chromium firefox`,
      filename: '/test/.github/workflows/release.yml',
    },
  ],
})
