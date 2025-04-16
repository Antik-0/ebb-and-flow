import { defineConfig } from 'vitepress'

// https://vitepress.dev/blogs/site-config
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
        text: 'vue 响应式系统',
        collapsed: false,
        items: [
          { text: 'Reactive', link: '/vue/guide/reactive' },
          { text: 'BaseHandlers', link: '/vue/guide/baseHandlers' },
          { text: 'CollectionHandlers', link: '/vue/guide/collectionHandlers' },
          { text: 'Ref', link: '/vue/guide/ref' },
          { text: 'Effect', link: '/vue/guide/effect' },
          { text: 'Computed', link: '/vue/guide/computed' },
          { text: 'EffectScope', link: '/vue/guide/effectScope' }
        ]
      },
      {
        text: 'vue 源码解析(3.5+)',
        collapsed: true,
        items: [
          { text: 'reactive', link: '/vue/source/reactive' },
          { text: 'baseHandlers', link: '/vue/source/baseHandlers' },
          {
            text: 'collectionHandlers',
            link: '/vue/source/collectionHandlers'
          },
          {
            text: 'arrayInstrumentations',
            link: '/vue/source/arrayInstrumentations'
          },
          { text: 'ref', link: '/vue/source/ref' },
          { text: 'computed', link: '/vue/source/computed' },
          { text: 'dep', link: '/vue/source/dep' },
          { text: 'effect', link: '/vue/source/effect' },
          { text: 'effectScope', link: '/vue/source/effectScope' },
          { text: 'watch', link: '/vue/source/watch' }
        ]
      },
      {
        text: '杂谈',
        collapsed: false,
        items: [
          { text: 'Receiver', link: '/blogs/js-receiver' },
          { text: 'CSS-@layer', link: '/blogs/css-@layer' },
          { text: 'CSS-Effect', link: '/blogs/css-effect' },
          { text: 'CSS-毛玻璃', link: '/blogs/css-glass' },
          { text: 'CSS-视图过渡', link: '/blogs/view-transitions' },
          { text: 'Monorepos', link: '/blogs/monorepos' },
          { text: '项目规范', link: '/blogs/lint' },
          { text: '博客搭建', link: '/blogs/blog' },
          { text: '网络文章', link: '/blogs/links' },
          { text: 'node-版本管理', link: '/blogs/node-version' },
          { text: 'fetch-请求类封装', link: '/blogs/fetch-request' },
          { text: '手动渲染组件', link: '/blogs/manual-render' },
          { text: '防抖/节流', link: '/blogs/debounce' },
          { text: '数字滚动', link: '/blogs/count-animation' }
        ]
      },
      {
        text: '算法基础',
        collapsed: true,
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
