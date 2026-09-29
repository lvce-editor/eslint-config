import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import { lintSource } from '../src/lint.js'

test('playground uses ESLint core rules and reports diagnostics for selected rules', () => {
  const diagnostics = lintSource('alert("hello")', 'no-alert')
  assert.equal(diagnostics.length, 1)
  assert.equal(diagnostics[0].ruleId, 'no-alert')
  assert.equal(diagnostics[0].message, 'Unexpected alert.')
})

test('playground runs the repository regex rule', () => {
  const diagnostics = lintSource('function run() { return /test/ }', 'regex/hoist-regex')
  assert.equal(diagnostics.length, 1)
  assert.equal(diagnostics[0].ruleId, 'regex/hoist-regex')
})

test('malformed source returns ESLint parser diagnostics', () => {
  const diagnostics = lintSource('function {', 'no-alert')
  assert.equal(diagnostics.length, 1)
  assert.equal(diagnostics[0].fatal, true)
  assert.equal(diagnostics[0].ruleId, null)
})

test('static rule catalog contains all ESLint core rules and the repository rule', async () => {
  const catalog = JSON.parse(await readFile(new URL('../../../.tmp/static/rule-catalog.json', import.meta.url), 'utf8'))
  const ids = catalog.map(({ id }) => id)
  assert.equal(ids.length, builtinRules.size + 1)
  assert.ok(ids.includes('no-alert'))
  assert.ok(ids.includes('regex/hoist-regex'))
})

test('static artifact loads its catalog and updates diagnostics when the source changes', async () => {
  class Element {
    children = []
    handlers = new Map()
    textContent = ''
    value = ''

    append(element) {
      this.children.push(element)
    }

    addEventListener(type, callback) {
      this.handlers.set(type, callback)
    }

    replaceChildren() {
      this.children = []
    }

    dispatch(type) {
      this.handlers.get(type)?.()
    }
  }

  const elements = new Map(['#rule', '#source', '#rule-description', '#diagnostics', '#result-count'].map((selector) => [selector, new Element()]))
  elements.get('#source').value = 'alert("hello")'
  const originalDocument = globalThis.document
  const originalFetch = globalThis.fetch
  globalThis.document = {
    createElement: () => new Element(),
    querySelector: (selector) => elements.get(selector),
  }
  globalThis.fetch = async () => ({
    json: async () => JSON.parse(await readFile(new URL('../../../.tmp/static/rule-catalog.json', import.meta.url), 'utf8')),
  })

  try {
    await import(new URL('../../../.tmp/static/playground.js?artifact-test', import.meta.url).href)
    const ruleSelect = elements.get('#rule')
    const sourceInput = elements.get('#source')
    const diagnostics = elements.get('#diagnostics')
    const resultCount = elements.get('#result-count')

    assert.equal(ruleSelect.children.length, builtinRules.size + 1)
    assert.equal(resultCount.textContent, '1 issue')
    assert.match(diagnostics.children[0].textContent, /no-alert: Unexpected alert/)

    sourceInput.value = 'const answer = 42'
    sourceInput.dispatch('input')
    assert.equal(resultCount.textContent, '0 issues')

    ruleSelect.value = 'regex/hoist-regex'
    sourceInput.value = 'function run() { return /test/ }'
    ruleSelect.dispatch('change')
    assert.match(diagnostics.children[0].textContent, /regex\/hoist-regex: Regex should be hoisted/)

    sourceInput.value = 'function {'
    sourceInput.dispatch('input')
    assert.match(diagnostics.children[0].textContent, /Parsing error/)
  } finally {
    globalThis.document = originalDocument
    globalThis.fetch = originalFetch
  }
})
