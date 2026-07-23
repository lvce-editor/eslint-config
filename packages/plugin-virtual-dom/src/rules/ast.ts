import type * as ESTree from 'estree'

export interface PropertyNode extends ESTree.BaseNode {
  computed: boolean
  key: unknown
  type: 'Property'
  value: unknown
}

export interface ObjectExpressionNode extends ESTree.BaseNode {
  properties: readonly unknown[]
  type: 'ObjectExpression'
}

export interface ArrayExpressionNode extends ESTree.BaseNode {
  elements: readonly unknown[]
  type: 'ArrayExpression'
}

export interface IdentifierNode extends ESTree.BaseNode {
  name: string
  type: 'Identifier'
}

export interface LiteralNode extends ESTree.BaseNode {
  type: 'Literal'
  value: unknown
}

export interface TemplateLiteralNode extends ESTree.BaseNode {
  expressions: readonly unknown[]
  quasis: readonly TemplateElementNode[]
  type: 'TemplateLiteral'
}

export interface TemplateElementNode extends ESTree.BaseNode {
  type: 'TemplateElement'
  value: {
    cooked?: string | null
    raw: string
  }
}

export interface BinaryExpressionNode extends ESTree.BaseNode {
  left: unknown
  operator: string
  right: unknown
  type: 'BinaryExpression'
}

export interface CallExpressionNode extends ESTree.BaseNode {
  arguments: readonly unknown[]
  callee: unknown
  type: 'CallExpression'
}

export interface UnaryExpressionNode extends ESTree.BaseNode {
  argument: unknown
  operator: string
  type: 'UnaryExpression'
}

export interface MemberExpressionNode extends ESTree.BaseNode {
  computed: boolean
  object: unknown
  property: unknown
  type: 'MemberExpression'
}

export interface ArrowFunctionExpressionNode extends ESTree.BaseNode {
  type: 'ArrowFunctionExpression'
}

export interface FunctionExpressionNode extends ESTree.BaseNode {
  type: 'FunctionExpression'
}

export const isPropertyNode = (node: unknown): node is PropertyNode => {
  return (
    typeof node === 'object' && node !== null && 'type' in node && node.type === 'Property' && 'key' in node && 'value' in node && 'computed' in node
  )
}

export const isObjectExpressionNode = (node: unknown): node is ObjectExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'ObjectExpression' && 'properties' in node
}

export const isArrayExpressionNode = (node: unknown): node is ArrayExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'ArrayExpression' && 'elements' in node
}

export const isIdentifierNode = (node: unknown): node is IdentifierNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'Identifier' && 'name' in node
}

export const isLiteralNode = (node: unknown): node is LiteralNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'Literal' && 'value' in node
}

export const isTemplateLiteralNode = (node: unknown): node is TemplateLiteralNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'TemplateLiteral' && 'expressions' in node && 'quasis' in node
}

export const isBinaryExpressionNode = (node: unknown): node is BinaryExpressionNode => {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    node.type === 'BinaryExpression' &&
    'operator' in node &&
    'left' in node &&
    'right' in node
  )
}

export const isCallExpressionNode = (node: unknown): node is CallExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'CallExpression' && 'callee' in node && 'arguments' in node
}

export const isUnaryExpressionNode = (node: unknown): node is UnaryExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'UnaryExpression' && 'operator' in node && 'argument' in node
}

export const isMemberExpressionNode = (node: unknown): node is MemberExpressionNode => {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    node.type === 'MemberExpression' &&
    'object' in node &&
    'property' in node &&
    'computed' in node
  )
}

export const isArrowFunctionExpressionNode = (node: unknown): node is ArrowFunctionExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'ArrowFunctionExpression'
}

export const isFunctionExpressionNode = (node: unknown): node is FunctionExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'FunctionExpression'
}

export const getStaticPropertyName = (property: PropertyNode): string | undefined => {
  if (property.computed) {
    return undefined
  }
  if (isIdentifierNode(property.key)) {
    return property.key.name
  }
  if (isLiteralNode(property.key) && typeof property.key.value === 'string') {
    return property.key.value
  }
  return undefined
}

export const getProperty = (node: ObjectExpressionNode, name: string): PropertyNode | undefined => {
  return node.properties.find((property): property is PropertyNode => isPropertyNode(property) && getStaticPropertyName(property) === name)
}

export const hasProperty = (node: ObjectExpressionNode, name: string): boolean => {
  return Boolean(getProperty(node, name))
}

const virtualDomElementNames = new Set([
  'A',
  'Abbr',
  'Article',
  'Aside',
  'Audio',
  'Br',
  'Button',
  'Cite',
  'Code',
  'Col',
  'ColGroup',
  'Data',
  'Dd',
  'Del',
  'Div',
  'Dl',
  'Dt',
  'Figcaption',
  'Figure',
  'Footer',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'Header',
  'Hr',
  'I',
  'Img',
  'Input',
  'Ins',
  'Kbd',
  'Label',
  'Li',
  'Nav',
  'Ol',
  'Option',
  'P',
  'Pre',
  'Reference',
  'Root',
  'Search',
  'Section',
  'Select',
  'Span',
  'Table',
  'TBody',
  'Td',
  'Text',
  'TextArea',
  'Tfoot',
  'Th',
  'THead',
  'Time',
  'Tr',
  'Ul',
  'Video',
])

export const getVirtualDomElementName = (node: unknown): string | undefined => {
  if (
    !isMemberExpressionNode(node) ||
    node.computed ||
    !isIdentifierNode(node.object) ||
    !isIdentifierNode(node.property) ||
    !node.object.name.endsWith('Elements') ||
    !virtualDomElementNames.has(node.property.name)
  ) {
    return undefined
  }
  return node.property.name
}

export const isVirtualDomNode = (node: unknown): node is ObjectExpressionNode => {
  if (!isObjectExpressionNode(node)) {
    return false
  }
  const typeProperty = getProperty(node, 'type')
  return Boolean(typeProperty && (hasProperty(node, 'childCount') || getVirtualDomElementName(typeProperty.value)))
}

export const isTextCall = (node: unknown): boolean => {
  return isCallExpressionNode(node) && isIdentifierNode(node.callee) && node.callee.name === 'text'
}

export const isMemberExpressionWithProperty = (node: unknown, propertyName: string): boolean => {
  return isMemberExpressionNode(node) && !node.computed && isIdentifierNode(node.property) && node.property.name === propertyName
}

export const isNumericLiteral = (node: unknown): node is LiteralNode & { value: number } => {
  return isLiteralNode(node) && typeof node.value === 'number'
}

export const getStaticNumberValue = (node: unknown): number | undefined => {
  if (isNumericLiteral(node)) {
    return node.value
  }
  if (isUnaryExpressionNode(node) && node.operator === '-' && isNumericLiteral(node.argument)) {
    return -node.argument.value
  }
  return undefined
}

export const isStringLiteral = (node: unknown): node is LiteralNode & { value: string } => {
  return isLiteralNode(node) && typeof node.value === 'string'
}
