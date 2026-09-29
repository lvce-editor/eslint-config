import presetTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { rollup } from 'rollup'
import { root } from './root.js'

const loadPlugin = createRequire(import.meta.url)

/** @type {typeof import('@rollup/plugin-commonjs').default} */
const commonjs = loadPlugin('@rollup/plugin-commonjs')
/** @type {typeof import('@rollup/plugin-json').default} */
const json = loadPlugin('@rollup/plugin-json')
/** @type {typeof import('rollup-plugin-polyfill-node').default} */
const polyfillNode = loadPlugin('rollup-plugin-polyfill-node')

const playgroundRoot = join(root, 'packages', 'playground')
const outputRoot = join(root, '.tmp', 'static')
const output = join(outputRoot, 'playground.js')

await rm(outputRoot, { recursive: true, force: true })
await mkdir(outputRoot, { recursive: true })
await cp(join(playgroundRoot, 'index.html'), join(outputRoot, 'index.html'))
await cp(join(playgroundRoot, 'playground.css'), join(outputRoot, 'playground.css'))

const ruleCatalog = [...builtinRules.entries()]
  .map(([id, rule]) => ({ id, description: rule.meta?.docs?.description || 'ESLint core rule' }))
  .sort((a, b) => a.id.localeCompare(b.id))
ruleCatalog.push({ id: 'regex/hoist-regex', description: 'Enforce hoisting regexes to module scope' })
await writeFile(join(outputRoot, 'rule-catalog.json'), JSON.stringify(ruleCatalog, null, 2) + '\n')

const bundle = await rollup({
  input: join(playgroundRoot, 'src', 'main.js'),
  plugins: [
    json(),
    commonjs(),
    {
      name: 'resolve-node-prefixes',
      resolveId(source) {
        if (source.startsWith('node:')) return `\0polyfill-node.${source.slice(5)}.js`
        return null
      },
    },
    nodeResolve({ browser: true, extensions: ['.mjs', '.js', '.json', '.ts'], mainFields: ['browser', 'main'], preferBuiltins: false }),
    polyfillNode(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.ts'],
      presets: [presetTypeScript],
    }),
  ],
  onwarn(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return
    warn(warning)
  },
})

await bundle.write({ file: output, format: 'es', sourcemap: true })
await bundle.close()
