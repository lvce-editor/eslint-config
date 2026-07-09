import { RuleTester } from 'eslint'
import * as parser from 'yaml-eslint-parser'
import * as rule from '../src/rules/github-pages.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser,
  },
})

const filename = '/workspace/.github/workflows/ci.yml'

ruleTester.run('githubPages', rule, {
  invalid: [
    {
      code: `
name: CI

jobs:
  deploy:
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4`,
      errors: [
        {
          messageId: 'missingGithubPagesPermissions',
        },
        {
          messageId: 'missingGithubPagesConcurrency',
        },
      ],
      filename,
    },
    {
      code: `
name: CI

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4`,
      errors: [
        {
          messageId: 'missingGithubPagesConcurrency',
        },
      ],
      filename,
    },
    {
      code: `
name: CI

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  cancel-in-progress: false

jobs:
  deploy:
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v3`,
      errors: [
        {
          messageId: 'missingGithubPagesConcurrency',
        },
      ],
      filename,
    },
    {
      code: `
name: CI

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4`,
      errors: [
        {
          messageId: 'missingGithubPagesPermissions',
        },
      ],
      filename,
    },
  ],
  valid: [
    {
      code: `
name: CI

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4`,
      filename,
    },
    {
      code: `
name: Release

jobs:
  deploy:
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4`,
      filename: '/workspace/.github/workflows/release.yml',
    },
  ],
})
