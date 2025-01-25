import * as tsConfigCompilerOption from './tsconfig-compiler-option.ts'

export const meta = {
  type: 'problem' as const,
  docs: {
    description: 'Disallow not allowed keys in JSON objects',
  },
  messages: {
    noUncheckedSideEffectImport: 'noUncheckedSideEffectImport rule should be enabled',
  },
}

export const create = (context: any) => {
  return tsConfigCompilerOption.create(context, 'noUncheckedSideEffectImport')
}
