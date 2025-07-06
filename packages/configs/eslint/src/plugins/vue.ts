import pluginVue from 'eslint-plugin-vue'
import tsEslint from 'typescript-eslint'
import parserVue from 'vue-eslint-parser'

/**
 * reference: https://eslint.vuejs.org/rules/
 */
export function vue() {
  return tsEslint.config({
    extends: [
      ...pluginVue.configs['flat/base'],
      ...pluginVue.configs['flat/essential'],
      ...pluginVue.configs['flat/recommended'],
      ...pluginVue.configs['flat/strongly-recommended']
    ],
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        extraFileExtensions: ['.vue'],
        parser: tsEslint.parser,
        sourceType: 'module'
      }
    },
    rules: {
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/attributes-order': [
        'error',
        {
          alphabetical: true,
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'SLOT',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            ['ATTR_DYNAMIC', 'ATTR_STATIC'],
            'ATTR_SHORTHAND_BOOL',
            'CONTENT',
            'EVENTS'
          ]
        }
      ],
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style']
        }
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        { registeredComponentsOnly: true }
      ],
      'vue/component-options-name-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/define-macros-order': [
        'error',
        {
          defineExposeLast: true,
          order: [
            'defineOptions',
            'defineProps',
            'defineEmits',
            'defineModel',
            'defineSlots'
          ]
        }
      ],
      'vue/dot-location': ['error', 'property'],
      'vue/dot-notation': ['error', { allowKeywords: true }],
      'vue/eqeqeq': ['error', 'always'],
      'vue/html-closing-bracket-newline': 'error',
      'vue/html-indent': 'off',
      'vue/html-quotes': ['error', 'double'],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            component: 'always',
            normal: 'never',
            void: 'always'
          },
          math: 'always',
          svg: 'always'
        }
      ],
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/multiline-html-element-content-newline': 'error',
      'vue/no-empty-pattern': 'error',
      'vue/no-extra-parens': ['error', 'functions'],
      'vue/no-irregular-whitespace': 'error',
      'vue/no-loss-of-precision': 'error',
      'vue/no-reserved-component-names': 'error',
      'vue/no-restricted-syntax': [
        'error',
        'DebuggerStatement',
        'LabeledStatement',
        'WithStatement'
      ],
      'vue/no-restricted-v-bind': ['error', '/^v-/'],
      'vue/no-sparse-arrays': 'error',
      'vue/no-unused-refs': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/object-shorthand': [
        'error',
        'always',
        {
          avoidQuotes: true,
          ignoreConstructors: false
        }
      ],
      'vue/one-component-per-file': 'error',
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-template': 'error',
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'error',
      'vue/require-prop-types': 'error',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/space-infix-ops': 'error',
      'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
      'vue/v-on-event-hyphenation': [
        'error',
        'always',
        {
          autofix: true,
          ignore: []
        }
      ]
    }
  })
}
