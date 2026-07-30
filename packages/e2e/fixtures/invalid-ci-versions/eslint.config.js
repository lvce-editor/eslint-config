import * as config from '../../../plugin-github-actions/src/index.ts'
import { defineConfig } from 'eslint/config'

export default defineConfig([...config.default])
