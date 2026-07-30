import * as config from '../../../plugin-devcontainer/src/index.ts'
import { defineConfig } from 'eslint/config'

export default defineConfig([...config.default])
