import type { MarkdownData } from 'ebb-markdown'
import type { Component, VNode } from 'vue'
import { renderMarkdown } from 'ebb-markdown/render'
import { CodeGroup, CustomBlock } from 'ebb-theme/prose'
import { default as CssGlass } from './components/content/CssGlass.vue'
import { default as PageMeta } from './components/content/PageMeta.vue'
import { default as ProseA } from './components/content/ProseA.vue'
import { default as ProseH2 } from './components/content/ProseH2.vue'
import { default as ProseH3 } from './components/content/ProseH3.vue'
import { default as ProsePre } from './components/content/ProsePre.vue'
import { default as SvgLoading } from './components/content/SvgLoading.vue'

const components = {
  PageMeta,
  CodeGroup,
  CustomBlock,
  a: ProseA,
  h2: ProseH2,
  h3: ProseH3,
  pre: ProsePre,
  CssGlass,
  SvgLoading
}

interface ContentProps {
  data: MarkdownData
  path: string
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
