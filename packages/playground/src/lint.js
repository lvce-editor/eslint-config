import { Linter } from 'eslint/universal'
import * as hoistRegex from '../../plugin-regex/src/rules/hoist-regex.ts'

const regexRule = { meta: hoistRegex.meta, create: hoistRegex.create }

export const lintSource = (source, ruleId) => {
  const linter = new Linter()
  const diagnostics = linter.verify(
    source,
    {
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      plugins: {
        regex: { rules: { 'hoist-regex': regexRule } },
      },
      rules: {
        [ruleId]: 'error',
      },
    },
    'playground.js',
  )
  return diagnostics
}
