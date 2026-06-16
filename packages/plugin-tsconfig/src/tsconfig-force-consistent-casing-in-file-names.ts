import type { Rule } from 'eslint'
import * as tsConfigCompilerOption from './tsconfig-compiler-option.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Ensure that the forceConsistentCasingInFileNames rule is enabled',
  },
  messages: {
    forceConsistentCasingInFileNames: 'forceConsistentCasingInFileNames rule should be enabled',
  },
  type: 'problem' as const,
}

export const create = (context: any): ReturnType<typeof tsConfigCompilerOption.create> => {
  return tsConfigCompilerOption.create(context, 'forceConsistentCasingInFileNames')
}
