# 项目规范化

这是一个关于项目规范化的记录

思路：配置 **prettier**、**eslint**，利用 **git hooks**，在项目进行 git 提交的时候，对提交代码(暂存区)进行检查与格式化。

## Prettier 配置

安装 `prettier` 包。

```cmd
pnpm add -D prettier
```

配置 `.prettierrc` 文件。

```json
{
  "printWidth": 80, // 换行长度
  "semi": false, // 语句末尾不打印分号
  "singleQuote": true, // 单引号
  "trailingComma": "none", // 不打印尾随逗号
  "arrowParens": "avoid" // Omit parens when possible. Example: x => x
}
```

配置 `.prettierignore` 文件。

```json
dist
docs
*.md
*.html
pnpm-lock.yaml
```

## ESLint 配置

安装 `ESLint v9+` 包。

```cmd
pnpm add -D eslint
```

安装 `ESLint` 插件。

```cmd
<!-- vue官方维护的 ESLint 插件 -->
pnpm add -D eslint-plugin-vue

<!-- vue官方提供的解析器，需要 9.x 以上-->
pnpm add -D vue-eslint-parser

<!-- 解决 Prettier 和 ESLint 冲突的插件 -->
pnpm add -D eslint-config-prettier

<!-- ts解析器，如果项目不是ts可跳过 -->
pnpm add -D typescript-eslint
```

配置 `eslint.config.js` 文件 (这是新的[配置文件](https://eslint.org/docs/latest/use/configure/configuration-files)，需要 `ESLint v9+`)。

```js
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import typescriptParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  // ✨根据自身需求选择，所有可用配置见源文件
  ...pluginVue.configs['flat/base'],
  ...pluginVue.configs['flat/essential'],
  ...pluginVue.configs['flat/recommended'],
  ...pluginVue.configs['flat/strongly-recommended'],
  {
    files: ['src/**/*.ts', 'src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        sourceType: 'module'
      }
    },
    // ✨修改部分rules
    rules: {
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['Layout', 'Breadcrumb']
        }
      ],
      'vue/max-attributes-per-line': [
        'error',
        { singleline: { max: 1 }, multiline: { max: 1 } }
      ],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/custom-event-name-casing': ['error', 'camelCase']
    }
  },
  {
    ignores: ['node_modules/*', 'dist/*', 'docs/*']
  },

  // ✨确保 prettier 插件位于数组的尾巴，才能覆盖其他配置
  eslintConfigPrettier
]
```

## lint-staged 配置

安装 `lint-staged` 包，该包的作用是将 `git暂存区` 的文件传入 `Prettier/ESLint` 的 `CLI` 命令，这样就不用每次都全量扫描，只对提交的代码进行检查，从而提高速度。

```cmd
pnpm add -D lint-staged
```

安装完后，在 `package.json` 文件进行如下配置。

```json
{
  "lint-staged": {
    // 对传入的.ts, .vue文件先进行ESLint检查，再进行prettier格式化
    "*.{ts,vue}": ["eslint --fix", "prettier --write"],
    // 对传入的.json文件只需要进行格式化
    "*.json": ["prettier --write"]
  }
}
```

配置好 `lint-staged` 后，还不能直接对暂存区的代码进行检查，需要搭配 `git hooks` 使用。

## git-hooks 配置

这里选择 vue 源码使用的工具 - `simple-git-hooks`。

```cmd
pnpm add -D simple-git-hooks
```

打开 `package.json` 文件，加入如下选项。

```json
{
  "scripts": {
    // ...
    // 注册git-hook
    "postinstall": "simple-git-hooks"
  },
  "simple-git-hooks": {
    // git提交之前运行 `pnpm lint-staged` 命令，若命令返回值不是0，则 git 提交失败
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*.{ts,vue}": ["eslint --fix", "prettier --write"],
    "*.json": ["prettier --write"]
  }
}
```

配置好选项后，先运行一次 `pnpm postinstall` 注册 git-hook(每当更改 hook 要执行的命令后，都需要重新注册)，注册后在项目的 `.git/hooks` 文件下会生成一个 `pre-commit` 文件，`hooks` 文件夹下有很多 `.sample` 后缀的文件，这些都是示例文件，去掉后缀即可运行。

## 使用

完成上述配置后，在点击 git 提交就可以对代码进行规范检查了，当 git 提交失败的时候，可以通过 git 的命令输出查看哪些文件出问题。

但是 `vscode` 的命令输出会乱码，而且也无法跳转到错误，因此可以添加一个 **npm 脚本命令**。

```json
"scripts": {
    // ...
    "lint": "eslint --cache"
    // ...
  },
```

当 git 失败后，运行 **lint** 命令(默认是全量扫描，也可以传入指定文件)，即可在 CMD 终端查看更友好的错误提示，并通过点击跳转到目标文件，进行错误修复。
