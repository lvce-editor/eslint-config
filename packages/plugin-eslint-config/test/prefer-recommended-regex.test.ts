import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-recommended-regex.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('prefer-recommended-regex', rule, {
  invalid: [
    {
      code: `
import * as regex from '@lvce-editor/eslint-plugin-regex'
`,
      errors: [
        {
          messageId: 'preferRecommendedRegex',
        },
      ],
    },
    {
      code: `
import regex from '@lvce-editor/eslint-plugin-regex/dist/index.js'
`,
      errors: [
        {
          messageId: 'preferRecommendedRegex',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
import config from '@lvce-editor/eslint-config'

export default [...config, ...config.recommendedRegex]
`,
    },
    {
      code: `
import regex from 'eslint-plugin-regex'
`,
    },
  ],
})
