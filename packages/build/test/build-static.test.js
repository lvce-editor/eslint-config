import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const staticRoot = fileURLToPath(new URL('../../../.tmp/static/', import.meta.url))

test('static IDE export includes the entry point and path-prefixed runtime assets', async () => {
  const html = await readFile(new URL('../../../.tmp/static/index.html', import.meta.url), 'utf8')
  const runtimeDirectory = html.match(/\/eslint-config\/([a-f0-9]+)\/css\/App\.css/)?.[1]

  assert.ok(runtimeDirectory, 'entry point should load its stylesheet under the GitHub Pages subpath')
  assert.ok(html.includes(`/eslint-config/${runtimeDirectory}/packages/renderer-process/dist/rendererProcessMain.js`))
  await access(new URL(`../../../.tmp/static/${runtimeDirectory}/manifest.json`, import.meta.url))

  const rendererWorkerPath = new URL(`../../../.tmp/static/${runtimeDirectory}/packages/renderer-worker/dist/rendererWorkerMain.js`, import.meta.url)
  await access(rendererWorkerPath)
  assert.ok((await readdir(staticRoot)).includes(runtimeDirectory), 'versioned runtime directory should be copied to the Pages artifact')
})
