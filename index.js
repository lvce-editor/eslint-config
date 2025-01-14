import eslint from '@eslint/js'
import nodePlugin from 'eslint-plugin-n'
import perfectionist from 'eslint-plugin-perfectionist'
import { createFileComposition, createFolderStructure, projectStructurePlugin } from 'eslint-plugin-project-structure'
import tseslint from 'typescript-eslint'

const folderStructureConfig = createFolderStructure({
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
              children: [{ name: '{folderName}.ts' }],
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
      rootSelectorsLimits: [{ selector: ['interface', 'type', 'function', 'variable', 'arrowFunction', 'class'], limit: 1 }],
      rules: [],
    },
  ],
})

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  nodePlugin.configs['flat/recommended'],
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
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'error',
    },
  },
  {
    rules: {
      'prefer-destructuring': ['error', { object: true, array: false }],
    },
  },
  {
    rules: {
      'n/prefer-node-protocol': 'error',
    },
  },
  {
    rules: {
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
    },
  },
  {
    rules: {
      'n/no-unpublished-import': 'off', // TODO enable this for some node packages, which don't bundle dependencies
    },
  },
  {
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
)
