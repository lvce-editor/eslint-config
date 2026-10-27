import type { Rule } from 'eslint'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { findMember, isObjectNode, isStringNode } from './ast.ts'

const nodeImagePattern = /^mcr\.microsoft\.com\/devcontainers\/javascript-node:(\d+)(?:\.|$)/u
const nvmrcPattern = /^v?(\d+)(?:\.|$)/u

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Ensure that the devcontainer Node.js image major matches .nvmrc',
  },
  messages: {
    nodeMajorMismatch: 'devcontainer image Node.js major ({{imageMajor}}) must match .nvmrc major ({{nvmrcMajor}})',
  },
  type: 'problem' as const,
}

const getRepositoryRoot = (filename: string): string => dirname(dirname(filename))

const readNvmrcMajor = (filename: string): string | undefined => {
  try {
    const nvmrc = readFileSync(join(getRepositoryRoot(filename), '.nvmrc'), 'utf8').trim()
    return nvmrc.match(nvmrcPattern)?.[1]
  } catch {
    return undefined
  }
}

export const create = (context: Rule.RuleContext): { readonly Document: (node: any) => void } => {
  return {
    Document(node: any): void {
      if (!isObjectNode(node.body)) {
        return
      }
      const image = findMember(node.body, 'image')
      if (!image || !isStringNode(image.value)) {
        return
      }
      const imageMajor = image.value.value.match(nodeImagePattern)?.[1]
      const nvmrcMajor = readNvmrcMajor(context.filename)
      if (imageMajor && nvmrcMajor && imageMajor !== nvmrcMajor) {
        context.report({
          data: { imageMajor, nvmrcMajor },
          loc: image.value.loc,
          messageId: 'nodeMajorMismatch',
        })
      }
    },
  }
}
