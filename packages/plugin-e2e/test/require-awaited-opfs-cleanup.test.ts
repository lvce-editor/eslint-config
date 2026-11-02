import { RuleTester } from 'eslint'
import * as rule from '../src/rules/require-awaited-opfs-cleanup.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

ruleTester.run('require-awaited-opfs-cleanup', rule, {
  invalid: [
    {
      code: `async function test(root, options) { try { await root.getDirectoryHandle('dir', { create: true }) } finally { await root.removeEntry('dir', { recursive: true, ...options }) } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getDirectoryHandle('dir', { create: true }) } finally { await root.removeEntry('dir', { recursive: true, recursive: false }) } }`,
      errors: [{ messageId: 'cleanup' }],
    },

    {
      code: `async function test(root) { try { root.getFileHandle('file', { create: true }) } finally { await root.removeEntry('file') } }`,
      errors: [{ messageId: 'cleanup' }],
    },

    { code: `async function test(root, options) { await root.getFileHandle('file', options) }`, errors: [{ messageId: 'cleanup' }] },
    { code: `async function test(root, flag) { await root.getFileHandle('file', { create: flag }) }`, errors: [{ messageId: 'cleanup' }] },
    { code: `async function test(root, options) { await root.getFileHandle('file', { ...options }) }`, errors: [{ messageId: 'cleanup' }] },
    {
      code: `async function test(root) { try { await root.getFileHandle('file', { create: true }) } finally { return; await root.removeEntry('file') } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getFileHandle('file', { create: true }) } finally { if (failed) return; await root.removeEntry('file') } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { let name = 'file'; try { await root.getFileHandle(name, { create: true }); name = 'other' } finally { await root.removeEntry(name) } }`,
      errors: [{ messageId: 'cleanup' }],
    },

    {
      code: `async function test(root) { await root.getFileHandle('file', { create: true }) }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getFileHandle('file', { create: true }) } finally { root.removeEntry('file') } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getFileHandle('file', { create: true }) } finally { void root.removeEntry('file') } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getFileHandle('file', { create: true }) } finally { await root.removeEntry('other') } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root, other) { try { await root.getFileHandle('file', { create: true }) } finally { await other.removeEntry('file') } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getDirectoryHandle('dir', { create: true }) } finally { await root.removeEntry('dir') } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getDirectoryHandle('dir', { create: true }) } finally { await root.removeEntry('dir', { recursive: false }) } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getFileHandle('file', { create: true }) } finally { if (false) await root.removeEntry('file') } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getFileHandle('file', { create: true }) } finally { const cleanup = async () => { await root.removeEntry('file') } } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { return async () => { await root.getFileHandle('file', { create: true }) } } finally { await root.removeEntry('file') } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { await root.getFileHandle('file', { create: true }); await root.removeEntry('file') }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getFileHandle('file', { create: true }); await root.removeEntry('file') } catch {} }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root.getFileHandle('file', { create: true }) } finally { { const root = other; await root.removeEntry('file') } } }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(root) { try { await root['getFileHandle']('file', { 'create': true }) } finally {} }`,
      errors: [{ messageId: 'cleanup' }],
    },
    {
      code: `async function test(file) { const writable = await file.createWritable(); await writable.write('text'); await writable.close() }`,
      errors: [{ messageId: 'close' }],
    },
    {
      code: `async function test(file) { const writable = await file.createWritable(); try { await writable.write('text') } finally { writable.close() } }`,
      errors: [{ messageId: 'close' }],
    },
    {
      code: `async function test(file, other) { const writable = await file.createWritable(); try { await writable.write('text') } finally { await other.close() } }`,
      errors: [{ messageId: 'close' }],
    },
  ],
  valid: [
    `async function test(root) { await root.getFileHandle('existing') }`,
    `async function test(root) { await root.getDirectoryHandle('existing', { create: false }) }`,
    `async function test(root) { try { await root.getFileHandle('file', { create: true }); throw new Error('assertion') } finally { await root.removeEntry('file') } }`,
    `async function test(root) { try { await root.getDirectoryHandle('dir', { create: true }) } finally { await root.removeEntry('dir', { recursive: true }) } }`,
    `async function test(root) { try { const dir = await root.getDirectoryHandle('dir', { create: true }); await dir.getFileHandle('nested', { create: true }) } finally { await root.removeEntry('dir', { recursive: true }) } }`,
    `async function test(root) { const name = 'file'; try { await root.getFileHandle(name, { create: true }) } finally { await root.removeEntry(name) } }`,
    `async function test(root) { const alias = root; try { await alias.getFileHandle('file', { create: true }) } finally { await root.removeEntry('file') } }`,
    `async function test(root) { const file = await root.getFileHandle('file', { create: true }); try { await file.getFile() } finally { await root.removeEntry('file') } }`,
    `async function test(file) { const writable = await file.createWritable(); try { await writable.write('text') } finally { await writable.close() } }`,
    `async function test(file) { const writable = await file.createWritable(); try { throw new Error('write') } finally { await writable.close() } }`,
    `async function test(root) { try { await root.getFileHandle('a', { create: true }); await root.getFileHandle('b', { create: true }) } finally { try { await root.removeEntry('a') } finally { await root.removeEntry('b') } } }`,
  ],
})
