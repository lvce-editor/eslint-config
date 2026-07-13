import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require npm tasks to run in a consistent order',
  },

  messages: {
    invalidNpmTaskOrder: '{{task}} must run after {{laterTask}}',
  },

  type: 'problem',
} as const

const npmTaskOrder = ['npm run build', 'npm run build:static', 'npm test', 'npm run type-check', 'npm run lint'] as const

type NpmTask = (typeof npmTaskOrder)[number]

interface NpmTaskStep {
  readonly node: AST.YAMLScalar
  readonly order: number
  readonly task: NpmTask
}

const getNpmTask = (value: string): NpmTask | undefined => {
  const command = value.trim()
  for (const task of npmTaskOrder) {
    if (command === task || command.startsWith(`${task} `)) {
      return task
    }
  }
  return undefined
}

const getNpmTaskStep = (entry: AST.YAMLContent | AST.YAMLWithMeta | null): NpmTaskStep | undefined => {
  if (entry?.type !== 'YAMLMapping') {
    return undefined
  }

  for (const pair of entry.pairs) {
    if (pair.key?.type !== 'YAMLScalar' || pair.key.value !== 'run' || pair.value?.type !== 'YAMLScalar' || typeof pair.value.value !== 'string') {
      continue
    }
    const task = getNpmTask(pair.value.value)
    if (!task) {
      return undefined
    }
    return {
      node: pair.value,
      order: npmTaskOrder.indexOf(task),
      task,
    }
  }
  return undefined
}

const isStepsSequence = (node: AST.YAMLSequence): boolean => {
  return node.parent.type === 'YAMLPair' && node.parent.key?.type === 'YAMLScalar' && node.parent.key.value === 'steps'
}

export const create = (context: Rule.RuleContext): Record<string, (node: AST.YAMLSequence) => void> => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLSequence(node: AST.YAMLSequence): void {
      if (!isStepsSequence(node)) {
        return
      }

      const steps = node.entries.flatMap((entry) => {
        const step = getNpmTaskStep(entry)
        return step ? [step] : []
      })
      let earliestLaterStep: NpmTaskStep | undefined

      for (let index = steps.length - 1; index >= 0; index--) {
        const step = steps[index]
        if (!step) {
          continue
        }
        if (earliestLaterStep && step.order > earliestLaterStep.order) {
          context.report({
            data: {
              laterTask: earliestLaterStep.task,
              task: step.task,
            },
            messageId: 'invalidNpmTaskOrder',
            node: step.node,
          })
        }
        if (!earliestLaterStep || step.order < earliestLaterStep.order) {
          earliestLaterStep = step
        }
      }
    },
  }
}
