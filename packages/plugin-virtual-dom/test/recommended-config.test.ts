import { Linter } from 'eslint'
import { deepEqual, equal } from 'node:assert/strict'
import { test } from 'node:test'
import recommended from '../src/index.ts'

void test('disables static node hoisting in test files', () => {
  const code = `
import { VirtualDomElements } from './constants.js'

export const getNode = () => {
  return {
    childCount: 0,
    type: VirtualDomElements.Div,
  }
}
`

  const linter = new Linter()
  const sourceMessages = linter.verify(code, recommended, {
    filename: 'src/getNode.js',
  })
  equal(sourceMessages.length, 1)
  equal(sourceMessages[0].ruleId, 'virtual-dom/hoist-static-nodes')

  const testMessages = linter.verify(code, recommended, {
    filename: 'test/getNode.test.js',
  })
  deepEqual(testMessages, [])
})
