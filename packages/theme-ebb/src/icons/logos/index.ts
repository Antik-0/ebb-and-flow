import type { FC, SVGProps } from 'react'
import IconBun from './Bun.tsx'
import IconJson from './Json.tsx'
import IconNode from './Node.tsx'
import IconNuxt from './Nuxt.tsx'
import IconPnpm from './Pnpm.tsx'
import IconShell from './Shell.tsx'
import IconTypescript from './Typescript.tsx'
import IconVue from './Vue.tsx'

export const builtingLogoIcons = {
  bun: IconBun,
  json: IconJson,
  node: IconNode,
  nuxt: IconNuxt,
  pnpm: IconPnpm,
  shell: IconShell,
  ts: IconTypescript,
  vue: IconVue
} as Record<string, FC<SVGProps<SVGSVGElement>>>
