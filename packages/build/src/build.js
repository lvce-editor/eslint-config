import { execa } from 'execa'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.js'
import { bundleJs } from './bundleJs.js'

const tmp = join(root, '.tmp')
const dist = join(root, '.tmp', 'dist')

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

await execa(`npm`, ['run', 'build'], {
  cwd: join(root, 'packages', 'plugin-tsconfig'),
})

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

await writeJson(join(dist, 'package.json'), packageJson)

await cp(join(root, 'README.md'), join(dist, 'README.md'))
await cp(join(root, 'packages', 'plugin', 'index.js'), join(dist, 'index.js'))
await cp(join(root, 'packages', 'plugin', 'index.d.ts'), join(dist, 'index.d.ts'))
await cp(join(root, 'packages', 'plugin-tsconfig', 'dist', 'index.js'), join(dist, 'rules.js'))
await cp(join(root, 'LICENSE'), join(dist, 'LICENSE'))

const indexPath = join(dist, 'index.js')
const indexContent = await readFile(indexPath, 'utf8')
const newIndexContent = indexContent.replace('../plugin-tsconfig/dist/index.js', './rules.js')
await writeFile(indexPath, newIndexContent)

for (const packageName of ['plugin-github-actions', 'plugin-tsconfig']) {
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
