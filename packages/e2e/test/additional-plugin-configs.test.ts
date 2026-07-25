import { expect, test } from '@jest/globals'
import { runConfiguredFixture, runFixture } from './util.ts'

const cases = [
  {
    expected: [
      {
        filePath: 'e2e/main.ts:3',
        message:
          'Use FileSystem.setFiles([...fileItems]) instead of multiple adjacent FileSystem.writeFile calls so files can be written in parallel.',
      },
    ],
    name: 'plugin-e2e-prefer-filesystem-set-files',
  },
  {
    expected: [
      {
        filePath: 'e2e/main.ts:2',
        message: 'Use toBeHidden() instead of not.toBeVisible().',
      },
    ],
    name: 'plugin-e2e-prefer-to-be-hidden',
  },
  {
    expected: [
      {
        filePath: 'tsconfig.json:3',
        message: 'assumeChangesOnlyAffectDirectDependencies rule should be enabled',
      },
    ],
    name: 'plugin-tsconfig-assume-direct-dependencies',
  },
  {
    expected: [
      {
        filePath: 'tsconfig.json:5',
        message: 'exactOptionalPropertyTypes rule should be enabled',
      },
    ],
    name: 'plugin-tsconfig-exact-optional-property-types',
  },
  {
    expected: [
      {
        filePath: 'tsconfig.json:6',
        message: 'forceConsistentCasingInFileNames rule should be enabled',
      },
    ],
    name: 'plugin-tsconfig-force-consistent-casing',
  },
  {
    expected: [
      {
        filePath: 'tsconfig.json:11',
        message: 'strict mode should be enabled',
      },
    ],
    name: 'plugin-tsconfig-strict',
  },
  {
    expected: [
      {
        filePath: 'extension.json:1',
        message: 'extensions with a main entry must configure contentSecurityPolicy',
      },
    ],
    name: 'plugin-extension-json-content-security-policy',
  },
  {
    expected: [
      {
        filePath: 'extension.json:4',
        message: 'extension keybinding key is invalid',
      },
    ],
    name: 'plugin-extension-json-valid-keybindings',
  },
  {
    expected: [
      {
        filePath: '.devcontainer/devcontainer.json:2',
        message: 'Unsupported devcontainer image: node:24',
      },
    ],
    name: 'plugin-devcontainer-allowed-image',
  },
  {
    expected: [
      {
        filePath: '.devcontainer/devcontainer.json:3',
        message: 'desktop-lite devcontainer feature must be enabled',
      },
    ],
    name: 'plugin-devcontainer-desktop-lite-feature',
  },
  {
    expected: [
      {
        filePath: '.github/workflows/ci.yml:4',
        message: 'Unsupported fail fast value: test',
      },
    ],
    name: 'plugin-github-actions-fail-fast',
  },
  {
    expected: [
      {
        filePath: '.github/workflows/ci.yml:7',
        message: 'Unsupported github token value: 123',
      },
    ],
    name: 'plugin-github-actions-github-token',
  },
  {
    expected: [
      {
        filePath: '.github/workflows/ci.yml:4',
        message: 'Unsupported max parallel value: test',
      },
    ],
    name: 'plugin-github-actions-max-parallel',
  },
  {
    expected: [
      {
        filePath: '.github/workflows/ci.yml:7',
        message: 'Unsupported npm registry value: https://example.com',
      },
    ],
    name: 'plugin-github-actions-npm-registry',
  },
  {
    expected: [
      {
        filePath: '.github/workflows/ci.yml:7',
        message: 'Unsupported node version file value: abc',
      },
    ],
    name: 'plugin-github-actions-node-version-file',
  },
  {
    expected: [
      {
        filePath: '.github/workflows/ci.yml:4',
        message: 'Unsupported timeout minutes value: test',
      },
    ],
    name: 'plugin-github-actions-timeout-minutes',
  },
  {
    expected: [
      {
        filePath: 'src/main.ts:1',
        message: 'Add an accessible name to this virtual-dom `Button` control.',
      },
    ],
    name: 'plugin-virtual-dom-accessible-control-name',
  },
  {
    expected: [
      {
        filePath: 'src/main.ts:3',
        message: 'Add an explicit `role` to clickable virtual-dom div nodes.',
      },
    ],
    name: 'plugin-virtual-dom-clickable-div-role',
  },
] as const

test.each(cases)('$name', async ({ expected, name }) => {
  expect(await runConfiguredFixture(name)).toEqual(expected)
})

test('plugin-github-actions-needs-reference', async () => {
  const { expected, parsed } = await runFixture('invalid-needs-reference')
  expect(parsed).toEqual(expected)
})

test('plugin-github-actions-working-directory', async () => {
  const { expected, parsed } = await runFixture('invalid-working-directory')
  expect(parsed).toEqual(expected)
})
