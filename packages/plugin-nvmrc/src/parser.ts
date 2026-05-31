const createProgram = (): any => {
  return {
    type: 'Program',
    body: [],
    sourceType: 'script',
    range: [0, 0],
    loc: {
      start: {
        line: 1,
        column: 0,
      },
      end: {
        line: 1,
        column: 0,
      },
    },
    comments: [],
    tokens: [],
  }
}

export const parseForESLint = () => {
  return {
    ast: createProgram(),
    services: {
      isNvmrc: true,
    },
    scopeManager: null,
    visitorKeys: {
      Program: ['body'],
    },
  }
}

export const meta = {
  name: 'nvmrc-parser',
  version: '0.0.1',
}
