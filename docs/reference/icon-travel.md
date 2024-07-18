# 图标之旅

## 回溯过往 - 字体图标

在过去的项目中，我都是使用字体图标来渲染前端图标。如果要为现有项目的图标集添加一个新的图标，是一件很繁琐的事情：

当 UI 设计好图标后，需要上传到阿里图标站点，然后再重新下载一份字体文件和样式表，重新引入到项目中。

这个过程对我来说有两个讨厌的问题：

- 重新引入的图标文件会产生多处的 git 修改记录
- UI 上传的字体图标的类名往往非常混乱，没有规范

由于图标命名随意，如果我不专门去修改而直接使用的话，就会导致项目的代码十分的丑陋。一想到 `jiantou1、shangjiantou2` 这样的代码在项目中随处可见，就不禁令人头疼。

### Why not use icon font?

> Do not use icon fonts!!!
>
> - 图标字体很丑。浏览器使用字体渲染方法渲染图标，这会导致图标边缘模糊和图标失去清晰度。
> - 由图标字体呈现的图标通常很难对齐，导致图标不对齐。
> - 浏览器加载巨大的字体只是为了渲染一些图标。这可以通过使用自定义图标字体来解决，但不能解决其他问题。
> - 没有彩色图标，只有单调，没有 SVG 动画。

以上是援引 Iconify 的阐述，[原文可见此处](https://iconify.design/docs/iconify-icon/#icon-font)。

对于以上几点，我深有感触：加载字体图标至少需要 2 个文件，一个二进制字体文件和一个样式表，如果一个页面只用到了部分图标，但是浏览器还是要在一开始就加载这两个文件才能渲染出图标，这无疑增加了资源的消耗。并且由于字体图标是通过字体的方式渲染的，只能够简单的修改字体颜色，或者应用一些简单的 `css transform`，过于单调的效果让人十分沮丧，并且字体图标的对齐有时候也是一个令人头疼的问题。

## 踏上旅途 - SVG

字体图标诞生至今已有十几年的历史了，早些年，由于浏览器对 SVG 的支持漏洞百出，字体图标是一个很好的解决方法，可以方便地在网页中使用它，并且可以像处理文本一样轻松地调整大小和颜色，而不需要额外的 HTTP 请求。但是现在，那些糟糕的日子已经过去了，现代的浏览器对 SVG 的支持已经十分完善，并且还有 `web components` 等新技术的不断注入，SVG 将作为新的角色登场，字体图标不属于现代网络。

SVG 完美的解决了图标单调，失真，对齐的问题，但是也带来了一个重要的性能问题：每引入一个 SVG 图标就要增加一个 HTTP 请求。对于这个问题，可以使用 base64 编码来解决，但需要注意的是 base64 编码会让 SVG 内容的大小增加大约三分之一。

在学完 SVG 的基础后，我尝试上手制作一些复杂的动效图标，通过编码来绘制图形，需要掌握一些几何数学的知识才能绘制出各种曲线，这不是一件容易的事情。后来忙于工作，我只能放弃，并且继续在项目中使用字体图标，直到我遇见了 Iconify ...

## 新的篇章 - Iconify

Iconify 是一个 SVG 图标工具包，它的标语是：**_Freedom to choose icon_**。

传统使用 SVG 的方法有：内联到 `<img>, <picture>`标签，内联到 `background-image` 样式中，以及直接作为 `<SVG>` 元素内嵌到 HTML。

除此之外，Iconify 还提供了额外的使用方式：新的 CSS 样式声明，原生 web components，与 React/Vue 等框架的集成。

### SVG in CSS

根据图标的颜色来区分，SVG 图标有两种颜色编码方式：

- 纯色图标，软编码，可以通过修改文本颜色来修改图标颜色
- 彩色图标，硬编码，自带调色板，无法修改颜色

对于纯色/彩色的图标，分别通过如下的 `CSS` 声明来使用：

```css
/* 纯色 */
.mdi--arrow-all {
  --svg: url('data:image/svg+xml ...');
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

/* 彩色 */
.logos--chrome {
  --svg: url("data:image/svg+xml ...")
  display: inline-block;
  width: 1em;
  height: 1em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: var(--svg);
}
```

可以看到纯色图标有一条 `background-color: currentColor;` 样式声明，这使得我们可以通过修改 `color` 值来更改图标的颜色。

::: tip
我们注意到图标是通过 Data URL 引用的，传统上将图片等资源转为 Data URL 是需要经过 base64 编码的，但是 SVG 不需要，因为 base64 是将二进制数据转为 ASCII 字符的编码规则，而 SVG 本身的内容已经是纯文本了，所以完全不需要进行 base64 编码，base64 编码会使得内容大小变大约三分之一。

[点击此处了解更多细节](https://css-tricks.com/probably-dont-base64-svg/)。
:::

要获取一个 Iconify 图标的 CSS 样式有两种方式。

1. [进入这个站点](https://icon-sets.iconify.design/?category=General)获取任意图标的 CSS 样式以及其他使用方式。
2. 通过构造 API 自动生成对应的图标样式：
   > URL 格式：`https://api.iconify.design/${图标集合的名称}.css?icons=${用,分割你想要的图标名称}`
   >
   > 例如：https://api.iconify.design/mdi-light.css?icons=alert-circle,circle,help-circle

这两种方式生成的 CSS 样式有一些不同，一种需要应用两个 class，一种只需要应用一个 class。

### SVG in Web Component

Iconify 推荐的方式就是使用 Web Component，因为 web 组件是浏览器的原生技术，可以很好的跨框架使用，但是原生组件的开发需要一定的学习成本，由于没有深入了解过，在此就不说明了，有兴趣的可以翻阅其[官方文档](https://iconify.design/docs/iconify-icon/)。

### SVG in Vue

要在 Vue 中使用 Iconify 提供的图标非常简单，Iconify 为 Vue 创建了一个组件可以访问所有的在线图标。

#### Install

```cmd
pnpm add -D @iconify/vue
```

#### Usage

安装完包后只需要引入其 `Icon` 组件，为了方便使用，可以将 `Icon` 组件进行全局注册。

```vue
<script setup lang="ts">
import { Icon } from '@iconify/vue'

const svgName = ref('twemoji:watermelon')
</script>

<template>
  <Icon icon="twemoji:watermelon" />
  <Icon icon="twemoji:watermelon" width="1em" height="1em" inline />
  <Icon :icon="svgName" />
</template>
```

::: tip
`Icon` 组件支持动态切换图标，并且不需要安装任何图标集，因为该组件内部有 API 可以自动下载对应的图标资源，欲了解更多[请移步此处](https://iconify.design/docs/api/icon-data.html)。
:::

### Unplugin Icons

Iconify 还提供了一个 [unplugin-icons](https://github.com/unplugin/unplugin-icons) 插件，可以将图标作为一个组件单独导入使用。

#### Install

```cmd
pnpm add -D unplugin-icons
```

#### Usage

::: code-group

```vue [demo]
<script setup>
import IconAccessibility from '~icons/carbon/accessibility'
import IconAccountBox from '~icons/mdi/account-box'
</script>

<template>
  <icon-accessibility />
  <icon-account-box style="font-size: 2em; color: red" />
</template>
```

```ts [vite.config.ts]
import Icons from 'unplugin-icons/vite' // [!code ++]

export default defineConfig({
  plugins: [
    Icons({
      autoInstall: false,
      scale: 1,
      compiler: 'vue3'
    })
  ]
})
```

:::

需要注意的是，对于要导入的图标需要安装其对应的图标集，比如上述例子就需要安装 `@iconify-json/carbon, @iconify-json/mdi` 这两个包后才能成功导入使用。

### Auto Importing

为每一个图标进行导入再使用十分的麻烦，一个图标的名称需要写 3 遍代码。幸运的是，可以搭配 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 插件实现自动导入。

#### Install

```cmd
pnpm add -D unplugin-vue-components
```

#### Usage

::: code-group

```vue [demo]
<script setup>
// 现在不再需要手动编写导入代码，unplugin-vue-components 会自动检测并完成导入
import IconAccessibility from '~icons/carbon/accessibility' // [!code --]
import IconAccountBox from '~icons/mdi/account-box' // [!code --]
</script>

<template>
  <icon-accessibility />
  <icon-account-box style="font-size: 2em; color: red" />
</template>
```

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

const __dirname__ = import.meta.dirname
const pathSrc = resolve(__dirname__, 'src')
const pathDts = resolve(__dirname__, 'types')

export default defineConfig({
  plugins: [
    Components({
      dirs: [resolve(pathSrc, 'components')],
      dts: resolve(pathDts, 'components.d.ts'),
      resolvers: [IconsResolver()]
    }),

    Icons({
      autoInstall: false,
      scale: 1,
      compiler: 'vue3'
    })
  ]
})
```

:::

## 深入探索 - 自定义图标构建

目前为止，我们都是使用 Iconify 提供的图标资源，虽然其提供了 `Over 200,000 open source vector icons`，但每个项目都应该是独特的，因此是时候构建一套属于项目的图标集了。

Iconify 除了提供图标的使用，还为开发者提供了 3 个包，可以帮助转换图标、操作图标集和生成图标。

- @iconify/types - 类型包
- @iconify/tools - 工具包，只能在 node 环境运行
- @iconify/utils - 工具包，可以在任意环境下运行

[点击此处了解更多细节](https://iconify.design/docs/libraries/)。

下面将使用这 3 个工具编写一个 `node` 脚本来构建项目的自定义图标。这个脚本构建的图标集作为项目的依赖包存在，通过 [Monorepos](./monorepos.md) 方式进行管理。

### 项目依赖

首先在项目根目录下创建 `packages/svgs/` 目录，其文件构建如下：

```
.
├─ packages
|  ├─ svgs
|  |  ├─ dist            // 打包产物
|  |  ├─ src
|  |  |  ├─ assets       // 图标的原始数据
|  |  |  ├─ cache        // 图标的缓存数据
|  |  |  └─ cleanup.ts   // 构建脚本
|  |  ├─ index.js
|  |  ├─ index.d.ts
|  |  ├─ package.json
|  |  └─ svgo.config.js  // svgo 配置
```

Iconify 对于处理的 SVG 文件有一些限制，如不能包含 Scripts、External resources、Raster images、Text 等，如果 SVG 文件不符合限制条件，Iconify 的工作流就会抛错，为此需要利用 [svgo](https://github.com/svg/svgo) 工具对 svg 文件进行预处理。并且脚本是 ts 文件，还需要一个工具能帮助执行 ts 文件，这里选择 `esno` 这个包。综上，构建自定义图标需要的依赖如下：

#### Install 依赖

```cmd
pnpm add @iconify/tools @iconify/utils svgo
pnpm add -D @iconify/types esno
```

#### 配置文件

::: code-group

```js [svgo.config.js]
export default {
  multipass: true,
  js2svg: {
    pretty: false
  },
  plugins: [
    // set of built-in plugins enabled by default
    'preset-default',

    'prefixIds',
    'removeScriptElement',
    'removeRasterImages',
    'convertStyleToAttrs',
    'cleanupListOfValues'
  ]
}
```

```json [package.json]
{
  "name": "@iconify-json/eaf",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "eaf iconify icons",
  "exports": {
    "./*": "./dist/*", // 打包产物
    ".": {
      "default": "./index.js", // 入口文件
      "types": "./idnex.d.ts"
    },
    "./cache/*": "./src/cache/*" // 缓存文件
  },
  "types": "index.d.ts",
  "scripts": {
    "postinstall": "pnpm run build",
    "build": "npx esno ./src/cleanup.ts", // 构建命令
    "build:svgo": "npx esno ./src/cleanup.ts --svgo"
  },
  "dependencies": {
    "@iconify/tools": "^4.0.4",
    "@iconify/utils": "^2.1.25",
    "svgo": "^3.3.2"
  },
  "devDependencies": {
    "@iconify/types": "^2.0.0",
    "esno": "^4.7.0"
  },
  "license": "MIT"
}
```

:::

### cleanup

构建脚本的入口是 `cleanup.ts`，脚本的主要任务是：

1. 导入源 SVG 文件并进行 `svgo` 优化
2. 利用 `@iconify/tools` 构建图标集对象
3. 利用 `@iconify/utils` 构建图标 CSS 文件

::: details 点击查看 cleanup.ts 源码

```ts
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { loadConfig, optimize } from 'svgo'
import {
  importDirectory,
  exportToDirectory,
  blankIconSet,
  cleanupSVG,
  parseColors,
  runSVGO,
  IconSet
} from '@iconify/tools'
import { getIconsCSS, quicklyValidateIconSet } from '@iconify/utils'

const __dirname__ = import.meta.dirname

function r(...path: string[]) {
  return resolve(__dirname__, ...path)
}

async function makeDir(path: string) {
  try {
    await fs.access(path)
  } catch (error) {
    await fs.mkdir(path)
  }
}

// paths
const svgoConfig = r('../svgo.config.js')
const assetsDir = r('./assets')
const cacheDir = r('./cache')
const distDir = r('../dist')

/**
 * SVGO 优化
 */
async function optimizeSVGO() {
  const config = await loadConfig(svgoConfig)
  const cacheList: Record<'name' | 'data', string>[] = []

  // import
  const fileList = await fs.readdir(assetsDir)
  for (const svgName of fileList) {
    const svgString = await fs.readFile(r(assetsDir, svgName), 'utf-8')
    cacheList.push({
      name: svgName,
      data: optimize(svgString, config).data
    })
  }

  // export
  for (const { name, data } of cacheList) {
    const filePath = r(cacheDir, name)
    await fs.writeFile(filePath, data, 'utf-8')
  }
}

/**
 * 构建 iconify 图标
 */
async function buildIcons(prefix: string) {
  const result = blankIconSet(prefix)

  const iconSet = await importDirectory(cacheDir)
  iconSet.forEach(name => {
    const svg = iconSet.toSVG(name)
    if (!svg) return

    try {
      cleanupSVG(svg, { keepTitles: false })
      parseColors(svg, { defaultColor: 'currentColor' })
      runSVGO(svg, { multipass: true, keepShapes: true })
    } catch (error) {
      console.warn(`❗Error cleanup ${name}.svg: ${error}`)
    }

    result.fromSVG(name, svg)
  })

  return result
}

/**
 * 导出 iconify 图标
 */
async function exportIcons(result: IconSet) {
  const prefix = result.prefix
  const exportJSON = result.export()

  // validate
  console.log(
    `✨ IconSet-${result.prefix} is valid data: `,
    quicklyValidateIconSet(exportJSON) !== null
  )

  // export *.svg to cache
  await exportToDirectory(result, {
    target: cacheDir,
    log: false
  })

  // export to dist/icons.json
  const targetJSON = r(distDir, `icons.json`)
  await fs.writeFile(
    targetJSON,
    JSON.stringify(exportJSON, null, '\t'),
    'utf-8'
  )
  console.log(`✨ Saved icons.json: ${targetJSON}`)

  // export to dist/info.json
  const iconsInfo = {
    name: prefix,
    total: result.count(),
    author: { name: prefix },
    license: { title: 'MIT' }
  }
  const targetInfo = r(distDir, `info.json`)
  await fs.writeFile(targetInfo, JSON.stringify(iconsInfo, null, '\t'), 'utf-8')
  console.log(`✨ Saved info.json: ${targetInfo}`)

  // export to dist/icons.css
  const names = result.list()
  const cssCode = getIconsCSS(exportJSON, names, {
    iconSelector: '.i-{prefix}--{name}',
    varName: 'svg',
    format: 'expanded'
  })
  const targetCSS = r(distDir, 'icons.css')
  await fs.writeFile(targetCSS, cssCode, 'utf8')
  console.log(`✨ Saved icons.css: ${targetCSS}`)
}

async function main() {
  makeDir(cacheDir)
  makeDir(distDir)

  try {
    await optimizeSVGO()

    const onlySVGO = process.argv.includes('--svgo')
    if (onlySVGO) return

    const prefix = 'eaf'
    const result = await buildIcons(prefix)
    await exportIcons(result)
  } catch (error) {
    console.log('icons build fail: ', error)
  }
}

main()
```

:::

通过命令 `pnpm run build` 将会在 `dist` 目录下生成如下文件：

```
.
├─ packages
|  ├─ svgs
|  |  ├─ dist
|  |  |  ├─ icons.css
|  |  |  ├─ icons.json
|  |  |  └─ info.json

```

### 配置使用

当完成构建后，回到项目根目录下的 `vite.config.ts` 文件配置自定义图标集合。

```ts
export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        IconsResolver({
          prefix: 'i', // [!code ++]
          customCollections: ['eaf'] // [!code ++]
        })
      ]
    }),

    Icons({
      customCollections: {
        ...ExternalPackageIconLoader('@iconify-json/eaf/icons.json') // [!code ++]
      }
    })
  ]
})
```

如果是通过 css class 使用，只需要在入口文件 main.ts 中导入构建后的 css 文件即可：

```ts
// main.ts
import '@iconify-json/eaf/icons.css' // [!code ++]
```

### 魔法工具 - UnoCSS

如果不想自己创建样式代码，不妨试试 [UnoCSS](https://unocss.dev/) 这个工具。

#### Install

```cmd
pnpm add -D unocss
```

#### Config

::: code-group

```ts [vite.config.ts]
import UnoCSS from 'unocss/vite' // [!code ++]

export default defineConfig({
  plugins: [
    UnoCss() // [!code ++]
  ]
})
```

```ts [uno.config.ts]
import { defineConfig, presetUno, presetIcons, presetTypography } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons({
      extraProperties: {
        display: 'inline-block'
      },
      collections: {
        // custom icons set
        eaf: () =>
          import('@iconify-json/eaf/icons.json').then(i => i.default as any),
        // logos icons set
        logos: () =>
          import('@iconify-json/logos/icons.json').then(i => i.default as any)
      }
    })
  ]
})
```

:::

::: tip
在 `uno.config.ts` 中的 `collections` 配置只是浏览器端的懒加载，只要图标集存在于项目的依赖中，`unocss` 就能够自动找到相应的图标。
:::

#### Usage

在 `unocss` 的帮助下，只需要输入 `i-eaf:ice` 这样的类名，`unocss` 就会去自动寻找对应的图标，并生成相应的 `css` 来渲染图标。

```vue
<script setup lang="ts"></script>

<template>
  <div class="i-eaf:ice"></div>
  <div class="i-logos:vue"></div>
</template>
```

### VSCode 插件

进一步的，还可以安装 `UnoCSS` 的 [VSCode](https://marketplace.visualstudio.com/items?itemName=antfu.unocss) 插件，这样在编辑器中也能够实时渲染出图标，提升开发体验。

### 动态渲染

很多时候需要根据条件来动态渲染图标，比如 `Element plus` 中的按钮组件，但是 `Element plus` 中的图标已经全部转变为组件形式了，这种情况下就无法通过绑定一个类名变量来进行动态渲染了。

要解决这个问题，可以编写一个能动态渲染组件的全局方法，如下所示：

```vue
<script setup lang="ts">
import { Icon } from '@iconify/vue'

const iconName = ref('logos:chrome')

function toggle() {
  if (iconName.value === 'logos:chrome') {
    iconName.value = 'logos:microsoft-edge'
  } else {
    iconName.value = 'logos:chrome'
  }
}

function $i(name: string) {
  return () => h(Icon, { icon: toValue(name) })
}
</script>

<template>
  <ElButton type="danger" size="large" :icon="$i(iconName)" @click="toggle">
    {{ iconName }}
  </ElButton>
</template>
```

未完待续...
