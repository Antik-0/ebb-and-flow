import type { Component } from 'vue'
import {
  Bun,
  Json,
  Node,
  Nuxt,
  Pnpm,
  Shell,
  Typescript,
  Vue
} from './logos.tsx'

export const builtingLogoIcons = {
  bun: Bun,
  json: Json,
  node: Node,
  nuxt: Nuxt,
  pnpm: Pnpm,
  shell: Shell,
  ts: Typescript,
  vue: Vue
} as Record<string, Component>
