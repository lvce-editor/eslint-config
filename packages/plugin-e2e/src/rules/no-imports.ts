import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

const allowedTypeImportSource = '@lvce-editor/test-with-playwright'

interface ImportDeclaration extends ESTree.BaseNode {
  readonly importKind?: 'type' | 'value'
  readonly source: ESTree.Literal
  readonly specifiers: readonly ImportSpecifier[]
  readonly type: 'ImportDeclaration'
}

interface ImportSpecifier extends ESTree.BaseNode {
  readonly importKind?: 'type' | 'value'
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow imports in e2e tests except type imports from @lvce-editor/test-with-playwright',
  },
  messages: {
    noImports: 'E2E tests must be self-contained. Only type imports from @lvce-editor/test-with-playwright are allowed.',
  },
  type: 'problem',
}

const isAllowedTypeImport = (node: ImportDeclaration): boolean => {
  if (node.source.value !== allowedTypeImportSource) {
    return false
  }
  if (node.importKind === 'type') {
    return true
  }
  return node.specifiers.length > 0 && node.specifiers.every((specifier) => specifier.importKind === 'type')
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ImportDeclaration(node: ImportDeclaration): void {
      if (isAllowedTypeImport(node)) {
        return
      }
      context.report({
        messageId: 'noImports',
        node,
      })
    },
  }
}
