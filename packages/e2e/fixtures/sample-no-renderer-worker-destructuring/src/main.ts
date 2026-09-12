import { FileSystemWorker } from '@lvce-editor/rpc-registry'

export const { invoke, set } = FileSystemWorker

export const openUri = (uri: string): unknown => {
  return FileSystemWorker.openUri(uri)
}
