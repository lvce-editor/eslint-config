import type { Rule } from 'eslint'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { findMember, isObjectNode, isStringNode } from './ast.ts'

const expectedPostCreateCommand = 'npm ci'
const playwrightInstallDepsPattern = /\bnpx\s+playwright\s+install-deps(?:\s|$|&&|;)/u
const playwrightInstallPattern = /\bnpx\s+playwright\s+install(?:\s|$|&&|;)/u
const dependencySections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Ensure that devcontainer postCreateCommand is configured correctly',
  },
  messages: {
    invalidPostCreateCommand: 'devcontainer postCreateCommand must be npm ci',
    missingPlaywrightPostinstall: 'packages/e2e/package.json postinstall must install Playwright dependencies',
    missingPostCreateCommand: 'devcontainer postCreateCommand must be configured',
    postCreateCommandMustBeString: 'devcontainer postCreateCommand must be a string',
  },
  type: 'problem' as const,
}

const readJson = (path: string): any => {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return undefined
  }
}

const hasPlaywrightDependency = (packageJson: any): boolean => {
  for (const section of dependencySections) {
    const dependencies = packageJson[section]
    if (!dependencies || typeof dependencies !== 'object') {
      continue
    }
    if ('playwright' in dependencies || '@playwright/test' in dependencies) {
      return true
    }
  }
  return false
}

const hasRequiredPlaywrightPostinstall = (packageJson: any): boolean => {
  const postinstall = packageJson.scripts?.postinstall
  if (typeof postinstall !== 'string') {
    return false
  }
  return playwrightInstallDepsPattern.test(postinstall) && playwrightInstallPattern.test(postinstall)
}

const shouldReportPlaywrightPostinstall = (cwd: string): boolean => {
  const packageJsonPath = join(cwd, 'packages', 'e2e', 'package.json')
  if (!existsSync(packageJsonPath)) {
    return false
  }
  const packageJson = readJson(packageJsonPath)
  if (!packageJson || !hasPlaywrightDependency(packageJson)) {
    return false
  }
  return !hasRequiredPlaywrightPostinstall(packageJson)
}

export const create = (context: Rule.RuleContext): { readonly Document: (node: any) => void } => {
  return {
    Document(node: any): void {
      if (!isObjectNode(node.body)) {
        context.report({
          loc: node.loc,
          messageId: 'missingPostCreateCommand',
        })
        return
      }
      const postCreateCommand = findMember(node.body, 'postCreateCommand')
      if (!postCreateCommand) {
        context.report({
          loc: node.body.loc,
          messageId: 'missingPostCreateCommand',
        })
      } else if (!isStringNode(postCreateCommand.value)) {
        context.report({
          loc: postCreateCommand.name.loc,
          messageId: 'postCreateCommandMustBeString',
        })
      } else if (postCreateCommand.value.value !== expectedPostCreateCommand) {
        context.report({
          loc: postCreateCommand.name.loc,
          messageId: 'invalidPostCreateCommand',
        })
      }

      if (shouldReportPlaywrightPostinstall(context.cwd)) {
        context.report({
          loc: node.body.loc,
          messageId: 'missingPlaywrightPostinstall',
        })
      }
    },
  }
}
