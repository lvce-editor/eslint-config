import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'

export const bundleJs = async ({ inFile, outFile }) => {
  /**
   * @type {import('rollup').RollupOptions}
   */
  const options = {
    input: inFile,
    preserveEntrySignatures: 'strict',
    treeshake: {
      propertyReadSideEffects: false,
    },
    output: {
      file: outFile,
      format: 'es',
      freeze: false,
      generatedCode: {
        constBindings: true,
        objectShorthand: true,
      },
      inlineDynamicImports: true,
    },
    external: ['@lvce-editor/ripgrep', 'electron', 'execa', 'ws', 'yaml-eslint-parser', 'eslint-compat-utils', 'eslint-plugin-yml', '@eslint/json'],
    plugins: [
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [pluginTypeScript],
      }),
      nodeResolve(),
    ],
  }

  const input = await rollup(options)
  // @ts-ignore
  await input.write(options.output)
}
