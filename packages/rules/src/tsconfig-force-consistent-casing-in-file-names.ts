import * as tsConfigCompilerOption from './tsconfig-compiler-option.ts'

export const meta = {
  type: 'problem' as const,
  docs: {
    description: 'Ensure that the forceConsistentCasingInFileNames rule is enabled',
  },
  messages: {
    forceConsistentCasingInFileNames: 'forceConsistentCasingInFileNames rule should be enabled',
  },
}

export const create = (context: any) => {
  return tsConfigCompilerOption.create(context, 'forceConsistentCasingInFileNames')
}
