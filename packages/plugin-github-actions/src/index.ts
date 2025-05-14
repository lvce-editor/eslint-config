import * as ciVersions from './ci-versions.ts'

const plugin = {
  meta: {
    name: 'github-actions',
    version: '0.0.1',
  },
  rules: {
    'ci-versions': ciVersions,
  },
}

const recommended = [
  {
    plugins: {
      'github-actions': plugin,
    },
  },
]

export default recommended
