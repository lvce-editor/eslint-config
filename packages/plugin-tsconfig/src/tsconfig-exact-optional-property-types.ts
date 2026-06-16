import type { Rule } from 'eslint'
import * as tsConfigCompilerOption from './tsconfig-compiler-option.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Enforce exactOptionalPropertyTypes',
  },
  messages: {
    exactOptionalPropertyTypes: 'exactOptionalPropertyTypes rule should be enabled',
  },
  type: 'problem' as const,
}

export const create = (context: any) => {
  return tsConfigCompilerOption.create(context, 'exactOptionalPropertyTypes')
}
