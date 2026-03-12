import type { MarkdownData } from 'ebb-markdown'
import type { Component, VNode } from 'vue'
import { renderMarkdown } from 'ebb-markdown/render'
import {
  CodeGroup,
  CustomBlock,
  PageMeta,
  ProseA,
  ProseH2,
  ProseH3,
  ProsePre
} from 'ebb-theme/prose'
import { default as CssGlass } from './components/CssGlass.vue'
import {
  ColorfulBorder,
  GridMotion,
  PlayonMotion,
  SvgSpinner
} from './components/effect'
import { default as SvgLoading } from './components/effect/SvgLoading.vue'

const components = {
  a: ProseA,
  h2: ProseH2,
  h3: ProseH3,
  pre: ProsePre,
  PageMeta,
  CodeGroup,
  CustomBlock,
  CssGlass,
  SvgLoading,
  SvgSpinner,
  ColorfulBorder,
  GridMotion,
  PlayonMotion
}

interface ContentProps {
  data?: MarkdownData | null
  path?: string
}

export function ContentRender({ path, data }: ContentProps) {
  if (!data) return null

  const children = renderMarkdown<Component, VNode>(data.body, h, components)
  return h(
    'div',
    {
      'data-path': path,
      'data-role': 'markdown'
    },
    children
  )
}
ContentRender.props = ['data', 'path']
