import { RuleTester } from 'eslint'
import { plugin } from '../src/index.ts'

const ruleTester = new RuleTester({
  plugins: {
    // @ts-ignore
    'github-actions': plugin,
  },
  language: 'yaml',
})

// @ts-ignore
ruleTester.run('strict', plugin.rules['yml/indent'], {
  valid: [
    {
      code: '\t',
      // @ts-ignore
      language: 'yaml',
    },
  ],
  invalid: [
    {
      code: '{"compilerOptions": { }}',
      errors: [
        {
          messageId: 'strict',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: '{"compilerOptions": { "strict": false }}',
      errors: [
        {
          messageId: 'strict',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 31,
        },
      ],
    },
  ],
})
