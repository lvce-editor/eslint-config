import type { Linter } from 'eslint'
import * as parser from './parser.ts'
import * as validVersion from './rules/valid-version.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'nvmrc',
    version: '0.0.1',
  },
  rules: {
    'valid-version': validVersion,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/.nvmrc'],
    languageOptions: {
      parser,
    },
    plugins: {
      nvmrc: plugin,
    },
    rules: {
      'nvmrc/valid-version': 'error',
    },
  },
]

export default recommended
