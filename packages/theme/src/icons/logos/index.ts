import type { Component } from 'vue'
import IconBun from './Bun.vue'
import IconJson from './Json.vue'
import IconNode from './Node.vue'
import IconNuxt from './Nuxt.vue'
import IconPnpm from './Pnpm.vue'
import IconShell from './Shell.vue'
import IconTypescript from './Typescript.vue'
import IconVue from './Vue.vue'

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
