import { expect, test } from '@jest/globals'
import { ESLint } from 'eslint'
import config from '../../plugin/index.js'

const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: config })

test('shared config rejects unsupported package versions', async () => {
  const [result] = await eslint.lintText('{"devDependencies":{"eslint":"10.10.0","typescript":"7.0.2"}}', { filePath: 'package.json' })
  const diagnostics = result.messages.filter((message) => message.ruleId === 'virtual-dom/no-restricted-dependencies')
  expect(diagnostics).toHaveLength(2)
  expect(diagnostics.map((message) => message.message)).toEqual([
    'Dependency "eslint" must use a version range within "<10.10.0-0"; received "10.10.0".',
    'Dependency "typescript" must use a version range within ">=6.0.0-0 <7.0.0-0"; received "7.0.2".',
  ])
})

test('shared config accepts supported package versions', async () => {
  const [result] = await eslint.lintText('{"devDependencies":{"eslint":"10.8.1","typescript":"^6.0.3"}}', {
    filePath: 'packages/worker/package.json',
  })
  expect(result.messages.filter((message) => message.ruleId === 'virtual-dom/no-restricted-dependencies')).toEqual([])
})
