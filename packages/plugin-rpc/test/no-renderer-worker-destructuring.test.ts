import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-rpc-registry-destructuring.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-rpc-registry-destructuring', rule, {
  invalid: [
    ...['FileSystemWorker', 'EditorWorker', 'FileSystemProcess', 'ExtensionHost', 'ProcessExplorer'].map((name) => ({
      code: `import { ${name} as Worker } from '@lvce-editor/rpc-registry'; export const { set } = Worker`,
      errors: [{ messageId: 'noRpcRegistryDestructuring' }],
    })),
    {
      code: "import * as Registry from '@lvce-editor/rpc-registry'; const { set: renamed, ...rest } = Registry['FileSystemWorker']",
      errors: [{ messageId: 'noRpcRegistryDestructuring' }],
    },
    {
      code: "import { FileSystemWorker } from '@lvce-editor/rpc-registry'; let set; ({ set } = FileSystemWorker)",
      errors: [{ messageId: 'noRpcRegistryDestructuring' }],
    },
    {
      code: `
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const { getActiveEditorId, set } = RendererWorker
`,
      errors: [
        {
          column: 14,
          endColumn: 40,
          endLine: 4,
          line: 4,
          messageId: 'noRpcRegistryDestructuring',
        },
      ],
    },
    {
      code: `
import { RendererWorker as Worker } from '@lvce-editor/rpc-registry'

const { set } = Worker
`,
      errors: [
        {
          messageId: 'noRpcRegistryDestructuring',
        },
      ],
    },
    {
      code: `
import * as RpcRegistry from '@lvce-editor/rpc-registry'

const { set } = RpcRegistry.RendererWorker
`,
      errors: [
        {
          messageId: 'noRpcRegistryDestructuring',
        },
      ],
    },
    {
      code: `
import { RendererWorker } from '@lvce-editor/rpc-registry'

let set
;({ set } = RendererWorker)
`,
      errors: [
        {
          messageId: 'noRpcRegistryDestructuring',
        },
      ],
    },
  ],
  valid: [
    { code: "import { FileSystemWorker } from '@lvce-editor/rpc-registry'; export const set = FileSystemWorker.set" },
    { code: "import * as Registry from '@lvce-editor/rpc-registry'; const { FileSystemWorker } = Registry" },
    { code: "import { FileSystemWorker } from '@lvce-editor/rpc-registry'; function read(FileSystemWorker) { const { set } = FileSystemWorker }" },
    { code: "import * as Registry from '@lvce-editor/rpc-registry'; function read(Registry) { const { set } = Registry.FileSystemWorker }" },
    {
      code: `
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const set = RendererWorker.set
`,
    },
    {
      code: `
const RendererWorker = createRendererWorker()
const { set } = RendererWorker
`,
    },
    {
      code: `
import { RendererWorker } from 'other-package'

const { set } = RendererWorker
`,
    },
    {
      code: `
import { RendererWorker } from '@lvce-editor/rpc-registry'

const readSet = (RendererWorker) => {
  const { set } = RendererWorker
  return set
}

RendererWorker.set()
`,
    },
    {
      code: `
import { RpcId as EditorWorker } from '@lvce-editor/rpc-registry'

const { set } = EditorWorker
`,
    },
  ],
})
