import { cp } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sharedProcess from '@lvce-editor/shared-process'
import { root } from './root.js'

const serverPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/server/package.json'))
const serverStaticPath = join(dirname(serverPackagePath), 'static')

process.env.PATH_PREFIX = '/eslint-config'
await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  serverStaticPath,
})

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
