const mockRpc = RendererWorker.registerMockRpc({
  testMethod() {
    return 'ok'
  },
})

using mockRpc2 = RendererWorker.registerMockRpc({
  testMethod() {
    return 'ok'
  },
})
