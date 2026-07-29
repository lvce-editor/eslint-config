import { RendererWorker } from '@lvce-editor/rpc-registry'

export const { invoke, set } = RendererWorker

export const openUri = (uri: string): unknown => {
  return RendererWorker.openUri(uri)
}
