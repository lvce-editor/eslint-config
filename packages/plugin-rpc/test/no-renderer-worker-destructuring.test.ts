import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-renderer-worker-destructuring.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('no-renderer-worker-destructuring', rule, {
  invalid: [
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
          messageId: 'noRendererWorkerDestructuring',
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
          messageId: 'noRendererWorkerDestructuring',
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
          messageId: 'noRendererWorkerDestructuring',
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
          messageId: 'noRendererWorkerDestructuring',
        },
      ],
    },
  ],
  valid: [
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
import { EditorWorker } from '@lvce-editor/rpc-registry'

const { set } = EditorWorker
`,
    },
  ],
})
