import devcontainerConfig from '../../plugin-devcontainer/src/index.ts'
import { defineConfig } from 'eslint/config'
import e2eConfig from '../../plugin-e2e/src/index.ts'
import { recommendedExtensionJson } from '../../plugin-extension/src/index.ts'
import githubActionsConfig from '../../plugin-github-actions/src/index.ts'
import tsconfigConfig from '../../plugin-tsconfig/src/index.ts'
import { strict as virtualDomStrictConfig } from '../../plugin-virtual-dom/src/index.ts'

export default defineConfig([
  ...devcontainerConfig,
  ...e2eConfig,
  ...recommendedExtensionJson,
  ...githubActionsConfig,
  ...tsconfigConfig,
  ...virtualDomStrictConfig,
])
