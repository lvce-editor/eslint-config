import eslint from '@eslint/js'
import pluginJest from 'eslint-plugin-jest'
import nodePlugin from 'eslint-plugin-n'
import perfectionist from 'eslint-plugin-perfectionist'
import { createFileComposition, createFolderStructure, projectStructurePlugin } from 'eslint-plugin-project-structure'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import tseslint from 'typescript-eslint'
import packageJson from 'eslint-plugin-package-json/configs/recommended'

const root = process.cwd()

mkdirSync(join(root, '.tmp'), { recursive: true })

const folderStructureConfig = createFolderStructure({
  projectRoot: root,
  structure: [
    {
      name: 'src',
      children: [
        {
          name: '{camelCase}.ts',
        },
        {
          name: 'parts',
          children: [
            {
              name: '{PascalCase}',
              children: [{ name: '{FolderName}.ts' }],
            },
          ],
        },
      ],
    },
  ],
})

const fileCompositionConfig = createFileComposition({
  filesRules: [
    {
      filePattern: '**/*.ts',
      rootSelectorsLimits: [{ selector: ['interface', 'type', 'function', 'arrowFunction', 'class'], limit: 1 }],
      rules: [],
    },
  ],
})

tseslint.configs.recommendedTypeChecked
/**
 * @type {any}
 */
const defaultConfig = tseslint.config(
  {
    files: ['**/*.ts'],
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          newlinesBetween: 'never',
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      {
        languageOptions: {
          parserOptions: {
            projectService: true,
            tsconfigRootDir: root,
          },
        },
      },
    ],
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-destructuring': ['error', { object: true, array: false }],

      // off
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'no-case-declarations': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // handled by typescript
    },
  },
  {
    files: ['**/*.test.ts'],
    extends: [pluginJest.configs['flat/recommended']],
    settings: {
      jest: {
        version: 29,
      },
    },
  },
  // {
  //   files: ['**/package.json'],
  //   extends: [packageJson],
  // },
  {
    ignores: [
      'dist',
      '.tmp',
      '**/build/**',
      '**/coverage/**',
      '**/server/**',
      '**/e2e/**',
      '**/memory/**',
      '**/test-integration/**',
      '**/test-integration-util/**',
      'scripts',
      'rollup.config.js',
      'eslint.config.js',
      'packages/text-search-worker/src/textSearchWorkerMain.ts',
    ],
  },
)

/**
 * @type {any}
 */
export const recommendedNode = [
  nodePlugin.configs['flat/recommended'],
  {
    rules: {
      'n/prefer-node-protocol': 'error',
      'n/no-unpublished-import': 'off', // TODO enable this for some node packages, which don't bundle dependencies
    },
  },
]

/**
 * @type {any}
 */
export const recommendedFolderStructucture = [
  {
    files: ['src/**/*.ts'],
    plugins: {
      'project-structure': projectStructurePlugin,
    },
    rules: {
      // If you have many rules in a separate file.
      'project-structure/file-composition': ['error', fileCompositionConfig],
      'project-structure/folder-structure': ['error', folderStructureConfig],
    },
  },
  {
    settings: {
      'project-structure/cache-location': join(root, '.tmp'),
    },
  },
]

export default defaultConfig
