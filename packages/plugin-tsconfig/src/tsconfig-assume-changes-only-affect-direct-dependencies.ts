import * as tsConfigCompilerOption from './tsconfig-compiler-option.ts'
import type { Rule } from 'eslint'

export const meta: Rule.RuleMetaData = {
  type: 'problem' as const,
  docs: {
    description: 'Ensure that the assumeChangesOnlyAffectDirectDependencies rule is enabled',
  },
  messages: {
    assumeChangesOnlyAffectDirectDependencies: 'assumeChangesOnlyAffectDirectDependencies rule should be enabled',
  },
}

export const create = (context: any) => {
  return tsConfigCompilerOption.create(context, 'assumeChangesOnlyAffectDirectDependencies')
}
