import { defineConfig } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import tsEslint from 'typescript-eslint'
import parserVue from 'vue-eslint-parser'

/**
 * reference: https://eslint.vuejs.org/rules/
 */
export default defineConfig({
  extends: [
    ...pluginVue.configs['flat/base'],
    ...pluginVue.configs['flat/essential'],
    ...pluginVue.configs['flat/strongly-recommended']
  ],
  files: ['**/*.vue'],
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
    'vue/multi-word-component-names': ['off'],
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/require-default-prop': ['off'],

    // Formatting
    'vue/first-attribute-linebreak': ['error'],
    'vue/html-closing-bracket-newline': ['error'],
    'vue/html-closing-bracket-spacing': ['error'],
    'vue/html-indent': ['error', 2],
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
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 3 },
        multiline: { max: 1 }
      }
    ],
    'vue/multiline-html-element-content-newline': [
      'error',
      { ignores: ['pre', 'textarea'] }
    ],
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/no-multi-spaces': ['error'],
    'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
    'vue/singleline-html-element-content-newline': ['off'],
    'vue/define-macros-order': [
      'error',
      {
        defineExposeLast: true,
        order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots']
      }
    ],
    'vue/padding-line-between-blocks': ['error', 'always'],

    // Recommended
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
    'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
    'vue/no-lone-template': ['error'],
    'vue/no-required-prop-with-default': ['error'],

    // Uncategorized
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      { registeredComponentsOnly: true }
    ],
    'vue/component-options-name-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    'vue/arrow-spacing': ['error', { before: true, after: true }],
    'vue/block-spacing': ['error', 'always'],
    'vue/comma-spacing': ['error'],
    'vue/key-spacing': ['error'],
    'vue/object-curly-newline': ['error', { multiline: true }],
    'vue/object-curly-spacing': ['error', 'always'],
    'vue/space-infix-ops': ['error']
  }
})
