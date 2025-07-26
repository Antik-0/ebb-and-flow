import js from '@eslint/js'
import type { Linter } from 'eslint'
import globals from 'globals'

export function javascript(): Linter.Config[] {
  return [
    js.configs.recommended,
    {
      languageOptions: {
        ecmaVersion: 'latest',
        globals: {
          ...globals.browser,
          ...globals.es2024,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly'
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          ecmaVersion: 'latest',
          sourceType: 'module'
        },
        sourceType: 'module'
      },
      rules: {
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'default-case-last': 'error',
        'dot-notation': 'error',
        eqeqeq: ['error', 'always'],
        'new-cap': 'error',
        'no-alert': 'error',
        'no-array-constructor': 'error',
        'no-caller': 'error',
        'no-const-assign': 'error',
        'no-constructor-return': 'error',
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-empty-function': 'error',
        'no-eval': 'error',
        'no-extra-bind': 'error',
        'no-implied-eval': 'error',
        'no-multi-str': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-proto': 'error',
        'no-throw-literal': 'error',
        'no-undef': 'off',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': 'error',
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true
          }
        ],
        'no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            vars: 'all',
            varsIgnorePattern: '^_'
          }
        ],
        'no-useless-computed-key': 'error',
        'no-useless-return': 'error',
        'no-var': 'error',
        'object-shorthand': [
          'error',
          'always',
          { avoidQuotes: true, ignoreConstructors: false }
        ],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'require-await': 'error',
        'symbol-description': 'error',
        yoda: ['error', 'never']
      }
    }
  ]
}
