import type { Linter } from 'eslint'
import pluginJSONC from 'eslint-plugin-jsonc'
import parserJSONC from 'jsonc-eslint-parser'

export function jsonc(): Linter.Config[] {
  return [
    ...pluginJSONC.configs['flat/recommended-with-jsonc'],
    {
      files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
      languageOptions: {
        parser: parserJSONC
      },
      plugins: {},
      rules: {
        'jsonc/indent': ['error', 2],
        'jsonc/key-spacing': [
          'error',
          {
            afterColon: true,
            beforeColon: false,
            mode: 'strict'
          }
        ],
        'jsonc/no-bigint-literals': 'error',
        'jsonc/no-binary-expression': 'error',
        'jsonc/no-number-props': 'error',
        'jsonc/no-comments': 'off'
      }
    },
    sortPackageJSON(),
    sortTSconfigJSON()
  ]
}

function sortPackageJSON(): Linter.Config {
  return {
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          order: [
            'name',
            'version',
            'description',
            'private',
            'author',
            'keywords',
            'homepage',
            'bugs',
            'repository',
            'license',
            'contributors',
            'categories',
            'funding',
            'icon',
            'contributes',
            'bin',
            'type',
            'files',
            'module',
            'main',
            'types',
            'imports',
            'exports',
            'packageManager',
            'engines',
            'scripts',
            'simple-git-hooks',
            'lint-staged',
            'dependencies',
            'devDependencies',
            'peerDependencies',
            'peerDependenciesMeta',
            'optionalDependencies',
            'pnpm'
          ],
          pathPattern: '^$'
        },
        {
          order: ['types', 'import', 'require', 'default'],
          pathPattern: '^exports.*$'
        },
        {
          order: { type: 'asc' },
          pathPattern: '^scripts.*$'
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(dependencies|devDependencies).*$'
        }
      ]
    }
  }
}

function sortTSconfigJSON(): Linter.Config {
  return {
    files: [
      '**/tsconfig.json',
      '**/tsconfig.*.json',
      'packages/configs/tsconfig/*.json'
    ],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          order: [
            'extends',
            'compilerOptions',
            'files',
            'include',
            'exclude',
            'references'
          ],
          pathPattern: '^$'
        },
        {
          // base on: https://www.typescriptlang.org/tsconfig/
          order: [
            // Projects
            'composite',
            'disableReferencedProjectLoad',
            'disableSolutionSearching',
            'disableSourceOfProjectReferenceRedirect',
            'incremental',
            'tsBuildInfoFile',
            // Language and Environment
            'lib',
            'emitDecoratorMetadata',
            'experimentalDecorators',
            'jsx',
            'jsxFactory',
            'jsxFragmentFactory',
            'jsxImportSource',
            'moduleDetection',
            'noLib',
            'reactNamespace',
            'target',
            'useDefineForClassFields',
            'checkJs',
            // Modules
            'baseUrl',
            'paths',
            'module',
            'moduleResolution',
            'moduleSuffixes',
            'allowArbitraryExtensions',
            'allowImportingTsExtensions',
            'allowUmdGlobalAccess',
            'customConditions',
            'noResolve',
            'noUncheckedSideEffectImports',
            'resolveJsonModule',
            'resolvePackageJsonExports',
            'resolvePackageJsonImports',
            'rootDir',
            'rootDirs',
            'typeRoots',
            'types',
            // Emit
            'declaration',
            'declarationDir',
            'declarationMap',
            'downlevelIteration',
            'emitBOM',
            'emitDeclarationOnly',
            'importHelpers',
            'inlineSourceMap',
            'inlineSources',
            'mapRoot',
            'newLine',
            'noEmit',
            'noEmitHelpers',
            'noEmitOnError',
            'outDir',
            'outFile',
            'preserveConstEnums',
            'removeComments',
            'sourceMap',
            'sourceRoot',
            'stripInternal',
            'skipLibCheck',
            // Interop Constraints
            'allowSyntheticDefaultImports',
            'esModuleInterop',
            'forceConsistentCasingInFileNames',
            'isolatedDeclarations',
            'isolatedModules',
            'preserveSymlinks',
            'verbatimModuleSyntax',
            // Type Checking
            'strict',
            'strictBindCallApply',
            'strictBuiltinIteratorReturn',
            'strictFunctionTypes',
            'strictNullChecks',
            'strictPropertyInitialization',
            'allowUnreachableCode',
            'allowUnusedLabels',
            'alwaysStrict',
            'exactOptionalPropertyTypes',
            'noFallthroughCasesInSwitch',
            'noImplicitAny',
            'noImplicitOverride',
            'noImplicitReturns',
            'noImplicitThis',
            'noPropertyAccessFromIndexSignature',
            'noUncheckedIndexedAccess',
            'noUnusedLocals',
            'noUnusedParameters',
            'useUnknownInCatchVariables',
            // Output Formatting
            'noErrorTruncation',
            'preserveWatchOutput',
            'pretty'
          ],
          pathPattern: '^compilerOptions$'
        }
      ]
    }
  }
}
