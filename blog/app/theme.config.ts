import type { ThemeConfig } from '@repo/theme'

export const themeConfig: ThemeConfig = {
  avatar: '/avatar.png',
  author: '潮起潮落',
  tagline: 'A Website Is Developed With',
  codes: [
    'VitePress',
    'The Vite',
    'The Vue',
    'The Unocss',
    'The Bun',
    'TypeScript'
  ],
  defaultActiveLink: '/vue/guide/reactive',
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
        { text: 'CSS-@layer', link: '/article/css-@layer' },
        { text: 'node-版本管理', link: '/article/node-version' },
        { text: 'fetch-封装', link: '/article/fetch-request' },
        { text: '手动渲染组件', link: '/article/manual-render' },
        { text: '防抖/节流', link: '/article/debounce' },
        { text: '数字滚动', link: '/article/count-animation' }
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
        },
        {
          text: 'vue 源码解析(3.5+)',
          collapsed: true,
          items: [
            { text: 'reactive', link: '/vue/source/reactive' },
            { text: 'baseHandlers', link: '/vue/source/base-handlers' },
            {
              text: 'collectionHandlers',
              link: '/vue/source/collection-handlers'
            },
            {
              text: 'arrayInstrumentations',
              link: '/vue/source/array-instrumentations'
            },
            { text: 'ref', link: '/vue/source/ref' },
            { text: 'computed', link: '/vue/source/computed' },
            { text: 'dep', link: '/vue/source/dep' },
            { text: 'effect', link: '/vue/source/effect' },
            { text: 'effectScope', link: '/vue/source/effect-scope' },
            { text: 'watch', link: '/vue/source/watch' }
          ]
        }
      ]
    },
    {
      text: '动效',
      icon: 'lucide:sparkles',
      collapsed: false,
      items: [
        { text: 'CSS-Effect', link: '/article/css-effect' },
        { text: 'CSS-毛玻璃', link: '/article/css-glass' },
        { text: 'CSS-视图过渡', link: '/article/view-transitions' }
      ]
    },
    {
      text: '更多',
      icon: 'ic:twotone-signpost',
      collapsed: false,
      items: [
        { text: 'Bimoe配置', link: '/article/biome' },
        { text: '传送门', link: '/article/links' },
        { text: '排序算法', link: '/algorithm/sort' }
      ]
    }
  ],
  socialLinks: [
    { icon: 'github', link: 'https://github.com/Antik-0/ebb-and-flow' }
  ]
}
