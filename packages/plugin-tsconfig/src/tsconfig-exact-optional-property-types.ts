import * as tsConfigCompilerOption from './tsconfig-compiler-option.ts'

export const meta = {
  type: 'problem' as const,
  docs: {
    description: 'Enforce exactOptionalPropertyTypes',
  },
  messages: {
    exactOptionalPropertyTypes: 'exactOptionalPropertyTypes rule should be enabled',
  },
}

export const create = (context: any) => {
  return tsConfigCompilerOption.create(context, 'exactOptionalPropertyTypes')
}
