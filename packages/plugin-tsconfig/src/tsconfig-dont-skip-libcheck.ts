import type { Rule } from 'eslint'
import * as tsConfigCompilerOption from './tsconfig-compiler-option.ts'

export const meta: Rule.RuleMetaData = {
  type: 'problem' as const,
  docs: {
    description: 'Enforce not skipping libCheck',
  },
  messages: {
    dontSkipLibCheck: "Don't skip libcheck",
  },
}

export const create = (context: any) => {
  return tsConfigCompilerOption.create(context, 'skipLibCheck', false)
}
