import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
const webBase = '/ebb-and-flow/'
export default defineConfig({
  title: '潮起潮落的小站',
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
        text: '参考',
        collapsed: false,
        items: [
          { text: 'Receiver', link: '/reference/receiver' },
          { text: '规范化', link: '/reference/lint' },
          { text: '博客搭建', link: '/reference/blog' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
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
  }

  // vite.config
  // vite: {
  //   configFile: 'vite.config.ts'
  // }
})
