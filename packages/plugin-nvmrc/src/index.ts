import type { Linter } from 'eslint'
import * as parser from './parser.ts'
import * as validVersion from './rules/valid-version.ts'

const plugin = {
  meta: {
    name: 'nvmrc',
    version: '0.0.1',
  },
  rules: {
    'valid-version': validVersion,
  },
  configs: {},
}

const recommended: Linter.Config[] = [
  {
    files: ['**/.nvmrc'],
    plugins: {
      nvmrc: plugin,
    },
    languageOptions: {
      parser,
    },
    rules: {
      'nvmrc/valid-version': 'error',
    },
  },
]

export default recommended
