import type { AST } from 'yaml-eslint-parser'

type MaybeYamlContent = AST.YAMLPair['value'] | undefined

export const isScalar = (node: MaybeYamlContent): node is AST.YAMLScalar => {
  return Boolean(node && node.type === 'YAMLScalar')
}

export const isMapping = (node: MaybeYamlContent): node is AST.YAMLMapping => {
  return Boolean(node && node.type === 'YAMLMapping')
}

export const getPairKey = (node: AST.YAMLPair): string | undefined => {
  if (isScalar(node.key) && typeof node.key.value === 'string') {
    return node.key.value
  }
  return undefined
}

export const getScalarStringValue = (node: MaybeYamlContent): string | undefined => {
  if (isScalar(node) && typeof node.value === 'string') {
    return node.value
  }
  return undefined
}

export const getScalarValue = (node: MaybeYamlContent): string | number | boolean | null | undefined => {
  if (isScalar(node)) {
    return node.value
  }
  return undefined
}

export const findPair = (mapping: AST.YAMLMapping, key: string): AST.YAMLPair | undefined => {
  return mapping.pairs.find((pair) => getPairKey(pair) === key)
}

export const getParentPair = (node: AST.YAMLMapping | AST.YAMLSequence): AST.YAMLPair | undefined => {
  return node.parent.type === 'YAMLPair' ? node.parent : undefined
}

export const isTopLevelPair = (node: AST.YAMLPair): boolean => {
  return node.parent.parent.type === 'YAMLDocument'
}

export const isStepMapping = (mapping: AST.YAMLMapping): boolean => {
  if (mapping.parent.type !== 'YAMLSequence') {
    return false
  }
  const parentPair = getParentPair(mapping.parent)
  return Boolean(parentPair && getPairKey(parentPair) === 'steps')
}

export const getTopLevelPair = (program: AST.YAMLProgram, key: string): AST.YAMLPair | undefined => {
  const [document] = program.body
  if (!document || !isMapping(document.content)) {
    return undefined
  }
  return findPair(document.content, key)
}
