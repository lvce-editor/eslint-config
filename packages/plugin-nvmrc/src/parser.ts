const createProgram = (): any => {
  return {
    body: [],
    comments: [],
    loc: {
      end: {
        column: 0,
        line: 1,
      },
      start: {
        column: 0,
        line: 1,
      },
    },
    range: [0, 0],
    sourceType: 'script',
    tokens: [],
    type: 'Program',
  }
}

export const parseForESLint = (): any => {
  return {
    ast: createProgram(),
    scopeManager: null,
    services: {
      isNvmrc: true,
    },
    visitorKeys: {
      Program: ['body'],
    },
  }
}

export const meta = {
  name: 'nvmrc-parser',
  version: '0.0.1',
}
