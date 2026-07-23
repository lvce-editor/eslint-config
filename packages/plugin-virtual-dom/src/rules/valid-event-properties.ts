import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getStaticPropertyName, isPropertyNode, isVirtualDomNode } from './ast.ts'

const supportedEventProperties = new Set([
  'onBeforeInput',
  'onBlur',
  'onChange',
  'onClick',
  'onContextMenu',
  'onDblClick',
  'onDragEnd',
  'onDragEnter',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onFocus',
  'onFocusIn',
  'onFocusOut',
  'onInput',
  'onKeyDown',
  'onKeyUp',
  'onMouseDown',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onPointerDown',
  'onPointerMove',
  'onPointerOut',
  'onPointerOver',
  'onScroll',
  'onSelectionChange',
  'onSubmit',
  'onWheel',
])

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require virtual-dom event properties supported by the renderer',
  },
  messages: {
    validEventProperty: '`{{name}}` is not a supported virtual-dom event property.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomNode(node)) {
        return
      }
      for (const property of node.properties) {
        if (!isPropertyNode(property)) {
          continue
        }
        const name = getStaticPropertyName(property)
        if (!name?.startsWith('on') || supportedEventProperties.has(name)) {
          continue
        }
        context.report({
          data: {
            name,
          },
          messageId: 'validEventProperty',
          node: property,
        })
      }
    },
  }
}
