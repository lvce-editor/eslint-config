import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/npm-task-order.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

ruleTester.run('npm-task-order', rule, {
  invalid: [
    {
      code: `
jobs:
  ci:
    runs-on: ubuntu-24.04
    steps:
      - run: npm run build
      - run: npm run lint
      - run: npm run type-check`,
      errors: [
        {
          column: 14,
          endColumn: 26,
          endLine: 7,
          line: 7,
          messageId: 'invalidNpmTaskOrder',
        },
      ],
    },
    {
      code: `
jobs:
  ci:
    runs-on: ubuntu-24.04
    steps:
      - run: npm run build:static
      - run: npm run build`,
      errors: [
        {
          data: {
            laterTask: 'npm run build',
            task: 'npm run build:static',
          },
          messageId: 'invalidNpmTaskOrder',
        },
      ],
    },
    {
      code: `
jobs:
  ci:
    runs-on: ubuntu-24.04
    steps:
      - run: npm test -- --runInBand
      - uses: actions/cache@v4
      - run: npm run build
      - run: npm run lint
      - run: npm run type-check -- --pretty false`,
      errors: [
        {
          data: {
            laterTask: 'npm run build',
            task: 'npm test',
          },
          messageId: 'invalidNpmTaskOrder',
        },
        {
          data: {
            laterTask: 'npm run type-check',
            task: 'npm run lint',
          },
          messageId: 'invalidNpmTaskOrder',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
jobs:
  ci:
    runs-on: ubuntu-24.04
    steps:
      - run: npm run build
      - run: npm run build:static
      - run: npm test
      - run: npm run type-check
      - run: npm run lint`,
    },
    {
      code: `
jobs:
  ci:
    runs-on: ubuntu-24.04
    steps:
      - run: npm run build
      - uses: actions/cache@v4
      - run: npm run type-check
  lint:
    runs-on: ubuntu-24.04
    steps:
      - run: npm run lint`,
    },
    {
      code: `
jobs:
  ci:
    runs-on: ubuntu-24.04
    steps:
      - run: npm run build-docs
      - run: npm run lint-fix
      - run: npm test:unit`,
    },
  ],
})
