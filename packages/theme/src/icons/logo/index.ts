import type { Component } from 'vue'
import IconBun from './bun.vue'
import IconJson from './json.vue'
import IconNode from './node.vue'
import IconNuxt from './nuxt.vue'
import IconPnpm from './pnpm.vue'
import IconShell from './shell.vue'
import IconTypescript from './typescript.vue'
import IconVue from './vue.vue'

export const builtingLogoIcons = {
  bun: IconBun,
  json: IconJson,
  node: IconNode,
  nuxt: IconNuxt,
  pnpm: IconPnpm,
  shell: IconShell,
  ts: IconTypescript,
  vue: IconVue
} as Record<string, Component>
