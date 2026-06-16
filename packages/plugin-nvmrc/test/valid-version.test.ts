import { RuleTester } from 'eslint'
import * as parser from '../src/parser.ts'
import * as rule from '../src/rules/valid-version.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
  },
})

ruleTester.run('valid-version', rule, {
  invalid: [
    {
      code: '',
      errors: [
        {
          column: 1,
          line: 1,
          messageId: 'invalidVersion',
        },
      ],
    },
    {
      code: 'lts/*',
      errors: [
        {
          column: 1,
          line: 1,
          messageId: 'invalidVersion',
        },
      ],
    },
    {
      code: '20.01.0',
      errors: [
        {
          column: 1,
          line: 1,
          messageId: 'invalidVersion',
        },
      ],
    },
    {
      code: '20.0.0-alpha',
      errors: [
        {
          column: 1,
          line: 1,
          messageId: 'invalidVersion',
        },
      ],
    },
    {
      code: '20.0.0+build',
      errors: [
        {
          column: 1,
          line: 1,
          messageId: 'invalidVersion',
        },
      ],
    },
    {
      code: '19.9.0',
      errors: [
        {
          column: 1,
          line: 1,
          messageId: 'versionTooOld',
        },
      ],
    },
    {
      code: '24.16.1',
      errors: [
        {
          column: 1,
          line: 1,
          messageId: 'versionTooNew',
        },
      ],
    },
    {
      code: '24.16.0',
      errors: [
        {
          column: 1,
          line: 1,
          messageId: 'badVersion',
        },
      ],
    },
    {
      code: '22.1.0',
      errors: [
        {
          column: 1,
          line: 1,
          messageId: 'badVersion',
        },
      ],
      options: [
        {
          badVersions: ['22.1.0'],
        },
      ],
    },
  ],
  valid: [
    {
      code: '20.0.0',
    },
    {
      code: 'v24.15.0',
    },
    {
      code: '19.0.0',
      options: [
        {
          minimumVersion: '18.0.0',
        },
      ],
    },
    {
      code: '25.0.0',
      options: [
        {
          maximumVersion: '25.0.0',
        },
      ],
    },
    {
      code: '24.16.0',
      options: [
        {
          badVersions: [],
          maximumVersion: '24.16.0',
        },
      ],
    },
  ],
})
