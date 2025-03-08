import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
const webBase = '/ebb-and-flow/'
export default defineConfig({
  title: '潮起潮落的站点',
  titleTemplate: '潮起潮落',
  description: '潮起潮落的个人博客',
  lang: 'zh-cn',
  base: webBase,
  cleanUrls: true,
  lastUpdated: true,
  appearance: 'force-dark',
  head: [['link', { rel: 'icon', href: webBase + 'logo.png' }]],
  themeConfig: {
    logo: '/logo.png',
    nav: [{ text: '主页', link: '/' }],
    sidebar: [
      {
        text: 'vue 源码解析',
        collapsed: false,
        items: [
          { text: 'Reactive', link: '/guide/reactive' },
          { text: 'BaseHandlers', link: '/guide/baseHandlers' },
          { text: 'CollectionHandlers', link: '/guide/collectionHandlers' },
          { text: 'Ref', link: '/guide/ref' },
          { text: 'Effect', link: '/guide/effect' },
          { text: 'Computed', link: '/guide/computed' },
          { text: 'EffectScope', link: '/guide/effectScope' }
        ]
      },
      {
        text: 'vue 源码解析(3.5+)',
        collapsed: true,
        items: [
          { text: 'reactive', link: '/source/reactive' },
          { text: 'baseHandlers', link: '/source/baseHandlers' },
          { text: 'collectionHandlers', link: '/source/collectionHandlers' },
          {
            text: 'arrayInstrumentations',
            link: '/source/arrayInstrumentations'
          },
          { text: 'ref', link: '/source/ref' },
          { text: 'computed', link: '/source/computed' },
          { text: 'dep', link: '/source/dep' },
          { text: 'effect', link: '/source/effect' }
        ]
      },
      {
        text: '参考',
        collapsed: false,
        items: [
          { text: 'Receiver', link: '/reference/receiver' },
          { text: 'CSS-@layer', link: '/reference/css-@layer' },
          { text: 'Monorepos', link: '/reference/monorepos' },
          { text: '视图过渡', link: '/reference/view-transitions' },
          { text: '项目规范', link: '/reference/lint' },
          { text: '博客搭建', link: '/reference/blog' },
          { text: '网络文章', link: '/reference/links' },
          { text: '图标之旅', link: '/reference/icon-travel' },
          { text: 'node-版本管理', link: '/reference/node-version' },
          { text: 'CSS-Effect', link: '/reference/css-effect' },
          { text: 'fetch-请求类封装', link: '/reference/fetch-request' },
          { text: '手动渲染组件', link: '/reference/manual-render' }
        ]
      },
      {
        text: '算法基础',
        collapsed: false,
        items: [{ text: '排序', link: '/algorithm/sort' }]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Antik-0/ebb-and-flow' }
    ],
    outline: {
      label: '页面导航',
      level: [2, 3]
    },
    search: {
      provider: 'local'
    },
    lastUpdated: {
      text: '最后更新于'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    returnToTopLabel: '回到顶部',
    externalLinkIcon: true
  },

  // vite.config
  vite: {
    configFile: 'vite.config.ts'
  }
})
