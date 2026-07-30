import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-recommended-actions.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('prefer-recommended-actions', rule, {
  invalid: [
    {
      code: `
import * as actions from '@lvce-editor/eslint-plugin-github-actions'
`,
      errors: [
        {
          messageId: 'preferRecommendedActions',
        },
      ],
    },
    {
      code: `
import actions from '@lvce-editor/eslint-plugin-github-actions/dist/index.js'
`,
      errors: [
        {
          messageId: 'preferRecommendedActions',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
import config from '@lvce-editor/eslint-config'

export default [...config, ...config.recommendedActions]
`,
    },
    {
      code: `
import actions from 'eslint-plugin-github-actions'
`,
    },
  ],
})
