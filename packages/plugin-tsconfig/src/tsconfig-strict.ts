import * as tsConfigCompilerOption from './tsconfig-compiler-option.ts'

export const meta = {
  type: 'problem' as const,
  docs: {
    description: 'Ensure that the strict mode is enabled',
  },
  messages: {
    strict: 'strict mode should be enabled',
  },
}

export const create = (context: any) => {
  return tsConfigCompilerOption.create(context, 'strict')
}
