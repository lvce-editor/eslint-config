import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

const eslintConfigModule = 'eslint/config'
const defineConfigName = 'defineConfig'

interface DefineConfigBindings {
  readonly named: ReadonlySet<string>
  readonly namespaces: ReadonlySet<string>
}

const getImportedName = (specifier: any): string | undefined => {
  const { imported } = specifier
  if (imported?.type === 'Identifier') {
    return imported.name
  }
  if (imported?.type === 'Literal' && typeof imported.value === 'string') {
    return imported.value
  }
  return undefined
}

const getDefineConfigBindings = (program: ESTree.Program): DefineConfigBindings => {
  const named = new Set<string>()
  const namespaces = new Set<string>()
  for (const statement of program.body) {
    if (statement.type !== 'ImportDeclaration' || statement.source.value !== eslintConfigModule) {
      continue
    }
    for (const specifier of statement.specifiers) {
      if (specifier.type === 'ImportNamespaceSpecifier') {
        namespaces.add(specifier.local.name)
      } else if (specifier.type === 'ImportSpecifier' && getImportedName(specifier) === defineConfigName) {
        named.add(specifier.local.name)
      }
    }
  }
  return { named, namespaces }
}

const isDefineConfigProperty = (node: any): boolean => {
  if (node.computed) {
    return node.property?.type === 'Literal' && node.property.value === defineConfigName
  }
  return node.property?.type === 'Identifier' && node.property.name === defineConfigName
}

const isDefineConfigCall = (node: any, bindings: DefineConfigBindings): boolean => {
  if (node.type !== 'CallExpression') {
    return false
  }
  const { callee } = node
  if (callee.type === 'Identifier') {
    return bindings.named.has(callee.name)
  }
  return (
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    bindings.namespaces.has(callee.object.name) &&
    isDefineConfigProperty(callee)
  )
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Enforce using defineConfig from eslint/config for ESLint flat configurations',
  },
  messages: {
    useDefineConfig: 'Wrap the default export in `defineConfig` imported from `eslint/config`.',
  },
  type: 'suggestion',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    'Program:exit'(program: ESTree.Program): void {
      const bindings = getDefineConfigBindings(program)
      const defaultExport = program.body.find(
        (statement): statement is ESTree.ExportDefaultDeclaration => statement.type === 'ExportDefaultDeclaration',
      )
      if (defaultExport && isDefineConfigCall(defaultExport.declaration, bindings)) {
        return
      }
      context.report({
        messageId: 'useDefineConfig',
        node: defaultExport ?? program,
      })
    },
  }
}
