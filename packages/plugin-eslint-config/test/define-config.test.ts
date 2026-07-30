import { RuleTester } from 'eslint'
import * as rule from '../src/rules/define-config.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('define-config', rule, {
  invalid: [
    {
      code: `
export default []
`,
      errors: [
        {
          messageId: 'useDefineConfig',
        },
      ],
    },
    {
      code: `
import { defineConfig } from 'other-package'

export default defineConfig([])
`,
      errors: [
        {
          messageId: 'useDefineConfig',
        },
      ],
    },
    {
      code: `
import { defineConfig } from 'eslint/config'

export default []
`,
      errors: [
        {
          messageId: 'useDefineConfig',
        },
      ],
    },
    {
      code: `
import { defineConfig as createConfig } from 'eslint/config'

export default defineConfig([])
`,
      errors: [
        {
          messageId: 'useDefineConfig',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
import { defineConfig } from 'eslint/config'

export default defineConfig([])
`,
    },
    {
      code: `
import { defineConfig as createConfig } from 'eslint/config'

export default createConfig([])
`,
    },
    {
      code: `
import * as eslintConfig from 'eslint/config'

export default eslintConfig.defineConfig([])
`,
    },
    {
      code: `
import * as eslintConfig from 'eslint/config'

export default eslintConfig['defineConfig']([])
`,
    },
  ],
})
