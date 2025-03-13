# 项目规范

这是一个关于项目规范的记录。思路是：利用 `git hooks` 配置 **prettier**、**eslint**，在项目 `git` 提交信息前，对提交代码(暂存区)进行检查与格式化。

## Prettier

### Install

```bash
pnpm add -D prettier
```

### 配置

```json
// .prettierrc
{
  "printWidth": 80, // 换行长度
  "semi": false, // 语句末尾不打印分号
  "singleQuote": true, // 单引号
  "trailingComma": "none", // 不打印尾随逗号
  "arrowParens": "avoid" // Omit parens when possible. Example: x => x
}
```

```json
// .prettierignore
dist
docs
*.html
pnpm-lock.yaml
```

## ESLint

### Install

```bash
pnpm add -D eslint
```

### 插件

```bash
// vue官方维护的 ESLint 插件
pnpm add -D eslint-plugin-vue

// vue官方提供的解析器，需要 9.x 以上
pnpm add -D vue-eslint-parser

// 处理 Prettier 和 ESLint 冲突的插件
pnpm add -D eslint-config-prettier

// ts解析器，如果项目不是ts可跳过
pnpm add -D typescript-eslint
```

### 配置

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

## lint-staged

安装 `lint-staged` 包，该包的作用是将 `git暂存区` 的文件传入 `Prettier/ESLint` 的 `CLI` 命令，这样就不用每次都全量扫描，只对提交的代码进行检查，从而提高速度。

### Install

```bash
pnpm add -D lint-staged
```

安装完后，在 `package.json` 文件增加如下配置。

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

## git-hooks

这里选择 vue 项目使用的工具 - `simple-git-hooks`。

### Install

```bash
pnpm add -D simple-git-hooks
```

打开 `package.json` 文件，加入如下选项。

```json
{
  "scripts": {
    // ...
    // 注册git-hook
    "postinstall": "simple-git-hooks" // [!code ++]
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged", // [!code ++]
    "commit-msg": "node ./scripts/vertify-commit.js" // [!code ++]
  },
  "lint-staged": {
    "*.{ts,vue}": ["eslint --fix", "prettier --write"],
    "*.json": ["prettier --write"]
  }
}
```

`postinstall` 是 `npm hooks`，作用是在每次安装包后都重新注册 `git hooks`，也可以通过 `pnpm simple-git-hooks` 命令手动更新 `git hooks`，注册后的文件位于 `.git/hooks` 目录下。

`pre-commit` 是在提交代码之前，同时也在 `commit-msg hook` 之前，作用是对项目进行 lint 和 格式化。

`commit-msg` 是在提交信息之前，作用是对 git 的提交信息进行模板验证。

### 提交信息验证

其中 `./scripts/vertify-commit.js` 脚本的内容如下：

```js
import pc from 'picocolors'
import { readFileSync } from 'node:fs'
import path from 'path'

const msgPath = path.resolve('.git/COMMIT_EDITMSG')
const msg = readFileSync(msgPath, 'utf-8').trim()

const commitRE = /^(新增|修改|修复|回滚)(\(.+\))?：.{1,50}/

if (!commitRE.test(msg)) {
  console.log(
    pc.green(`
    提交信息不符合规范:
    提交信息：${msg}
    正则规范：${commitRE}
    `)
  )
  process.exit(1)
}
```
