import type { ThemeConfig } from '@repo/theme'
import { defineConfigWithTheme } from 'vitepress'

// https://vitepress.dev/blogs/site-config
const webBase = '/ebb-and-flow/'

export default defineConfigWithTheme<ThemeConfig>({
  title: '潮起潮落的站点',
  titleTemplate: '潮起潮落',
  description: '潮起潮落的个人博客',
  lang: 'zh-cn',
  base: webBase,
  srcDir: 'src',
  outDir: 'dist',
  cleanUrls: true,
  lastUpdated: true,
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', href: webBase + 'logo.png' }]
    // [
    //   'script',
    //   {
    //     async: 'true',
    //     src: 'https://fastly.jsdelivr.net/npm/live2d-widgets@1.0.0-rc.7/dist/autoload.js'
    //   }
    // ]
  ],
  themeConfig: {
    logo: '/logo.png',
    navMenus: [
      {
        text: '首页',
        icon: 'lucide:circle-dot',
        link: '/',
        items: []
      },
      {
        text: '文稿',
        icon: 'lucide:pencil-line',
        collapsed: false,
        items: [
          { text: 'CSS-@layer', link: '/blogs/css-@layer' },
          { text: 'node-版本管理', link: '/blogs/node-version' },
          { text: 'fetch-请求类封装', link: '/blogs/fetch-request' },
          { text: '手动渲染组件', link: '/blogs/manual-render' },
          { text: '防抖/节流', link: '/blogs/debounce' },
          { text: '数字滚动', link: '/blogs/count-animation' }
        ]
      },
      {
        text: '编程',
        icon: 'lucide:atom',
        grouped: true,
        items: [
          {
            text: 'Vue 源码解析',
            collapsed: true,
            items: [
              { text: 'Reactive', link: '/vue/guide/reactive' },
              { text: 'BaseHandlers', link: '/vue/guide/baseHandlers' },
              {
                text: 'CollectionHandlers',
                link: '/vue/guide/collectionHandlers'
              },
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
            text: '算法基础',
            collapsed: true,
            items: [{ text: '排序', link: '/algorithm/sort' }]
          }
        ]
      },
      {
        text: '特效',
        icon: 'lucide:sparkles',
        collapsed: false,
        items: [
          { text: 'CSS-Effect', link: '/blogs/css-effect' },
          { text: 'CSS-毛玻璃', link: '/blogs/css-glass' },
          { text: 'CSS-视图过渡', link: '/blogs/view-transitions' }
        ]
      },
      {
        text: '更多',
        icon: 'ic:twotone-signpost',
        collapsed: false,
        items: [
          { text: 'Bimoe配置', link: '/blogs/biome' },
          { text: '传送门', link: '/blogs/links' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Antik-0/ebb-and-flow' }
    ]
  },
  vite: {
    configFile: 'vite.config.ts'
  }
})
