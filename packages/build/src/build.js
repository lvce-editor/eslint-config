import { execa } from 'execa'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.js'
import { bundleJs } from './bundleJs.js'

const tmp = join(root, '.tmp')
const dist = join(root, '.tmp', 'dist')

const bundledPlugins = [
  {
    dependency: '@lvce-editor/eslint-plugin-tsconfig',
    packageName: 'plugin-tsconfig',
    uri: 'tsconfigUri',
    variable: 'tsconfigPlugin',
  },
  {
    dependency: '@lvce-editor/eslint-plugin-github-actions',
    packageName: 'plugin-github-actions',
    uri: 'actionsUri',
    variable: 'actionsPlugin',
  },
  {
    dependency: '@lvce-editor/eslint-plugin-regex',
    packageName: 'plugin-regex',
    uri: 'regexUri',
    variable: 'regexPlugin',
  },
  {
    dependency: '@lvce-editor/eslint-plugin-rpc',
    packageName: 'plugin-rpc',
    uri: 'rpcUri',
    variable: 'rpcPlugin',
  },
]

const readJson = async (path) => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content)
}

const writeJson = async (path, json) => {
  await writeFile(path, JSON.stringify(json, null, 2) + '\n')
}

const getGitTagFromGit = async () => {
  const { stdout, stderr, exitCode } = await execa('git', ['describe', '--exact-match', '--tags'], {
    reject: false,
  })
  if (exitCode) {
    if (exitCode === 128 && stderr.startsWith('fatal: no tag exactly matches')) {
      return '0.0.0-dev'
    }
    return '0.0.0-dev'
  }
  if (stdout.startsWith('v')) {
    return stdout.slice(1)
  }
  return stdout
}

const getVersion = async () => {
  const { env } = process
  const { RG_VERSION, GIT_TAG } = env
  if (RG_VERSION) {
    if (RG_VERSION.startsWith('v')) {
      return RG_VERSION.slice(1)
    }
    return RG_VERSION
  }
  if (GIT_TAG) {
    if (GIT_TAG.startsWith('v')) {
      return GIT_TAG.slice(1)
    }
    return GIT_TAG
  }
  return getGitTagFromGit()
}

await rm(tmp, { recursive: true, force: true })
await mkdir(dist, { recursive: true })

const version = await getVersion()

const packageJson = await readJson(join(root, 'package.json'))

delete packageJson.scripts
delete packageJson.devDependencies
delete packageJson.prettier
delete packageJson.jest
packageJson.version = version
packageJson.main = 'index.js'
for (const plugin of bundledPlugins) {
  packageJson.dependencies[plugin.dependency] = version
}

await writeJson(join(dist, 'package.json'), packageJson)

await cp(join(root, 'README.md'), join(dist, 'README.md'))
await cp(join(root, 'packages', 'plugin', 'index.js'), join(dist, 'index.js'))
await cp(join(root, 'packages', 'plugin', 'index.d.ts'), join(dist, 'index.d.ts'))
await cp(join(root, 'LICENSE'), join(dist, 'LICENSE'))

const indexPath = join(dist, 'index.js')
const indexContent = await readFile(indexPath, 'utf8')
const replaceDynamicPluginImport = (content, plugin) => {
  const pattern = new RegExp(
    String.raw`// @ts-ignore\s*\nconst ${plugin.uri} = '\.\./${plugin.packageName}/src/index\.ts'\s*\nconst ${plugin.variable} = await import\(${plugin.uri}\)`,
  )
  const replacement = `import * as ${plugin.variable} from '${plugin.dependency}'`
  return content.replace(pattern, replacement)
}

let newIndexContent = indexContent
for (const plugin of bundledPlugins) {
  newIndexContent = replaceDynamicPluginImport(newIndexContent, plugin)
}
await writeFile(indexPath, newIndexContent)

for (const plugin of bundledPlugins) {
  const packageName = plugin.packageName
  const packageJson = await readJson(join(root, 'packages', packageName, 'package.json'))
  delete packageJson.scripts
  delete packageJson.devDependencies
  delete packageJson.prettier
  delete packageJson.jest
  packageJson.version = version
  packageJson.main = 'dist/index.js'
  await mkdir(join(tmp, packageName))
  await writeJson(join(tmp, packageName, 'package.json'), packageJson)

  await bundleJs({
    inFile: join(root, 'packages', packageName, 'src/index.ts'),
    outFile: join(root, '.tmp', packageName, 'dist/index.js'),
  })
}
