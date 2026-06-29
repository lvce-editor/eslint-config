import type { Linter } from 'eslint'
import json from '@eslint/json'
import * as allowedImage from './rules/allowed-image.ts'
import * as postCreateCommand from './rules/post-create-command.ts'
import * as requireDesktopLiteFeature from './rules/require-desktop-lite-feature.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'devcontainer',
    version: '0.0.1',
  },
  rules: {
    'allowed-image': allowedImage,
    'post-create-command': postCreateCommand,
    'require-desktop-lite-feature': requireDesktopLiteFeature,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/.devcontainer/devcontainer.json'],
    language: 'json/jsonc',
    languageOptions: {
      allowTrailingCommas: true,
    },
    plugins: {
      devcontainer: plugin,
      // @ts-ignore
      json,
    },
    rules: {
      'devcontainer/allowed-image': 'error',
      'devcontainer/post-create-command': 'error',
      'devcontainer/require-desktop-lite-feature': 'error',
    },
  },
]

export default recommended
