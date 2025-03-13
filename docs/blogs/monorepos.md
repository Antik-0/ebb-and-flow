# Monorepos

最近在 `Github` 上浏览一些项目时，接触到一个 `monorepos` 概念，`vue` 生态的很多仓库都是通过这种模式对项目进行管理，因此通过本文小小记录一下。

`monorepos(单体仓库)`，简单来说就是将多个项目通过一个 `Git` 版本控制来进行管理，传统的做法则是一个项目对应一个 `Git` 版本控制，关于其概念就不展开，读者自行上网了解即可，下面通过一个简单的例子来说明。

## 创建子项目

首先通过 `pnpm create vite web` 命令快速创建一个 vue 模板项目，然后在根目录下创建一个 `packages` 目录用于存放子项目，同时创建 `client` 和 `server` 两个子包，其项目结构大致如下：

```
.
├─ packages
|  ├─ client
|  |  ├─ index.ts
|  |  ├─ hello.ts
|  |  └─ package.json
|  ├─ server
|  |  ├─ index.ts
|  |  └─ package.json
```

`client` 包下的各文件内容如下：

::: code-group

```ts [index.ts]
export function client() {
  console.log('this is client package!')
}
```

```ts [hello.ts]
export function helloWorld() {
  console.log('hello, world!')
}
```

```json [package.json]
{
  "name": "@pack/client", // 包名
  "version": "1.0.0",
  "description": "client",
  "main": "index.js",
  "exports": {
    // 对外暴露的接口
    ".": "./index.ts", // import {} from '@pack/client'
    "./hello": "./hello.ts" // import {} from '@pack/client/hello'
  }
}
```

:::

`server` 包的各文件内容如下：

::: code-group

```ts [index.ts]
export function server() {
  console.log('this is server!')
}
```

```json [package.json]
{
  "name": "@pack/server", // 包名
  "version": "1.0.0",
  "description": "server",
  "main": "index.js",
  "exports": {
    // 对外暴露的接口
    ".": "./index.ts" // import {} from '@pack/server'
  }
}
```

:::

## PNPM Workspace

在根目录创建 `PNPM` 工作空间配置文件 `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
```

## 引入 packages

修改根目录下的 `package.json` 文件如下：

```json
{
  "name": "web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.29"
  },
  "devDependencies": {
    "@pack/client": "workspace:^", // [!code ++]
    "@pack/server": "workspace:^", // [!code ++]
    "@vitejs/plugin-vue": "^5.0.5",
    "typescript": "^5.2.2",
    "vite": "^5.3.1",
    "vue-tsc": "^2.0.21"
  }
}
```

同时运行下述命令，安装 `workspace` 下的包

```bash
pnpm update @pack/client @pack/server
```

## 使用

安装后就可以在项目中正常使用了，在入口文件 `main.ts` 引入测试一下

```ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { server } from '@pack/server' // [!code ++]
import { client } from '@pack/client' // [!code ++]
import { helloWorld } from '@pack/client/hello' // [!code ++]
server() // [!code ++]
client() // [!code ++]
helloWorld() // [!code ++]

createApp(App).mount('#app')
```

安装过程中没有出现问题的话，浏览器控制台将有如下输出：

```
this is server!
this is client package!
hello, world!
```

## 下一步

以上就是一个简单的 `monorepos` 项目搭建，当项目逐渐发展得更加庞大和复杂后，还需要对其构建，CI 等流程进行性能优化，这时候就需要用到 [Turborepo](https://turbo.build/repo)...
