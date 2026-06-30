interface Process {
  readonly pid: number
  readonly ppid: number
}

interface ProcessExplorerState {
  readonly collapsedIds: readonly number[]
  readonly focusedIndex: number
  readonly processes: readonly Process[]
  readonly rootId: number
  readonly visibleProcesses: readonly Process[]
}

const getVisibleProcesses = (processes: readonly Process[], collapsedIds: readonly number[], rootId: number): readonly Process[] => {
  return processes.filter((process) => process.pid === rootId || !collapsedIds.includes(process.ppid))
}

export const collapseAll = (state: ProcessExplorerState): ProcessExplorerState => {
  const parentIds = new Set<number>()
  for (const process of state.processes) {
    parentIds.add(process.ppid)
  }
  const collapsedIds = state.processes.filter((process) => parentIds.has(process.pid)).map((process) => process.pid)
  const visibleProcesses = getVisibleProcesses(state.processes, collapsedIds, state.rootId)
  return {
    ...state,
    collapsedIds,
    focusedIndex: visibleProcesses.length === 0 ? -1 : 0,
    visibleProcesses,
  }
}
