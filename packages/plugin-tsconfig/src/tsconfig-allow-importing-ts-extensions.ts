import type { Rule } from 'eslint'
import * as tsConfigCompilerOption from './tsconfig-compiler-option.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Ensure that the allowImportingTsExtensions is enabled',
  },
  messages: {
    allowImportingTsExtensions: 'allowImportingTsExtensions rule should be enabled',
  },
  type: 'problem' as const,
}

export const create = (context: any) => {
  return tsConfigCompilerOption.create(context, 'allowImportingTsExtensions')
}
