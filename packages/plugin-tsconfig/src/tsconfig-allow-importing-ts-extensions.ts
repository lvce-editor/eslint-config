import * as tsConfigCompilerOption from './tsconfig-compiler-option.ts'

export const meta = {
  type: 'problem' as const,
  docs: {
    description: 'Ensure that the allowImportingTsExtensions is enabled',
  },
  messages: {
    allowImportingTsExtensions: 'allowImportingTsExtensions rule should be enabled',
  },
}

export const create = (context: any) => {
  return tsConfigCompilerOption.create(context, 'allowImportingTsExtensions')
}
