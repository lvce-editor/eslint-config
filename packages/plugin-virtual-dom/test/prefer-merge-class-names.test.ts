import { RuleTester } from 'eslint'
import * as rule from '../src/rules/prefer-merge-class-names.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('prefer-merge-class-names', rule, {
  invalid: [
    {
      code: `
const dom = {
  type: 'div',
  className: \`\${baseClass} \${selectedClass}\`,
}
`,
      errors: [
        {
          column: 14,
          endColumn: 45,
          endLine: 4,
          line: 4,
          messageId: 'preferMergeClassNames',
        },
      ],
    },
    {
      code: `
const dom = {
  type: 'div',
  className: baseClass + ' ' + selectedClass,
}
`,
      errors: [
        {
          column: 14,
          endColumn: 45,
          endLine: 4,
          line: 4,
          messageId: 'preferMergeClassNames',
        },
      ],
    },
    {
      code: `
const dom = {
  type: 'div',
  'className': baseClass + ' item',
}
`,
      errors: [
        {
          column: 16,
          endColumn: 35,
          endLine: 4,
          line: 4,
          messageId: 'preferMergeClassNames',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
const dom = {
  type: 'div',
  className: mergeClassNames(baseClass, selectedClass),
}
`,
    },
    {
      code: `
const dom = {
  type: 'div',
  className: 'button',
}
`,
    },
    {
      code: `
const dom = {
  type: 'div',
  className: \`icon-\${name}\`,
}
`,
    },
    {
      code: `
const dom = {
  type: 'div',
  className: \`\${className}\`,
}
`,
    },
    {
      code: `
const dom = {
  type: 'div',
  className,
}
`,
    },
    {
      code: `
const dom = {
  type: 'div',
  [classNameProperty]: \`\${baseClass} \${selectedClass}\`,
}
`,
    },
  ],
})
