import { defineThemeConfig } from '@ebb/theme'

export const themeConfig = defineThemeConfig(() => {
  return {
    title: '潮起潮落',
    titleTemplate: '<title> | 潮起潮落',
    avatar: '/avatar.png',
    author: '潮起潮落',
    tagline: 'A Website Is Developed With',
    codes: [
      'The Nuxt',
      'The Vue',
      'The Bun',
      'The Unocss',
      'Motion-Vue',
      'TypeScript'
    ],
    defaultActiveLink: '/articles',
    navMenus: [
      {
        text: '首页',
        icon: 'lucide:circle-dot',
        link: '/',
        hiddenInSidebar: true,
        items: []
      },
      {
        text: '文稿',
        icon: 'lucide:pencil-line',
        collapsed: false,
        items: [
          { text: 'CSS-@layer', link: '/article/css-@layer' },
          { text: 'node-版本管理', link: '/article/node-version' },
          { text: 'fetch-封装', link: '/article/fetch-request' },
          { text: '手动渲染组件', link: '/article/manual-render' },
          { text: '防抖/节流', link: '/article/debounce' },
          { text: '数字滚动', link: '/article/count-animation' },
          { text: 'Bimoe配置', link: '/article/biome' },
          { text: '传送门', link: '/article/links' },
          { text: '排序算法', link: '/article/sorting-algorithm' }
        ]
      },
      {
        text: '探索',
        icon: 'lucide:atom',
        grouped: true,
        items: [
          {
            text: 'Vue 源码解析',
            collapsed: true,
            items: [
              { text: 'reactive', link: '/vue/reactive' },
              { text: 'baseHandlers', link: '/vue/base-handlers' },
              { text: 'collectionHandlers', link: '/vue/collection-handlers' },
              {
                text: 'arrayInstrumentations',
                link: '/vue/array-instrumentations'
              },
              { text: 'ref', link: '/vue/ref' },
              { text: 'computed', link: '/vue/computed' },
              { text: 'dep', link: '/vue/dep' },
              { text: 'effect', link: '/vue/effect' },
              { text: 'effectScope', link: '/vue/effect-scope' },
              { text: 'watch', link: '/vue/watch' }
            ]
          },
          {
            text: 'Vue 源码解析(旧)',
            collapsed: true,
            items: [
              { text: 'Reactive', link: '/vue/guide/reactive' },
              { text: 'BaseHandlers', link: '/vue/guide/base-handlers' },
              {
                text: 'CollectionHandlers',
                link: '/vue/guide/collection-handlers'
              },
              { text: 'Ref', link: '/vue/guide/ref' },
              { text: 'Effect', link: '/vue/guide/effect' },
              { text: 'Computed', link: '/vue/guide/computed' },
              { text: 'EffectScope', link: '/vue/guide/effect-scope' }
            ]
          }
        ]
      },
      {
        text: '动效',
        icon: 'lucide:sparkles',
        collapsed: true,
        items: [
          { text: 'CSS-Effect', link: '/article/css-effect' },
          { text: 'CSS-毛玻璃', link: '/article/css-glass' },
          { text: 'CSS-视图过渡', link: '/article/view-transitions' }
        ]
      },
      {
        text: '归档',
        icon: 'ic:twotone-signpost',
        link: '/articles',
        items: []
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Antik-0/ebb-and-flow' }
    ]
  }
})
