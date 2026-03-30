import type { MarkdownData } from 'ebb-markdown'
import type { VNode } from 'vue'
import { renderMarkdown } from 'ebb-markdown/render'
import {
  CodeGroup,
  CustomBlock,
  PageMeta,
  ProseA,
  ProseH2,
  ProseH3,
  ProseImg,
  ProsePre
} from 'ebb-theme/prose'
import {
  ColorfulBorder,
  GridMotion,
  PlayonMotion,
  SvgLoading,
  SvgSpinner
} from './components/CssEffect'
import { CssGlass } from './components/CssGlass'

const components = {
  a: ProseA,
  h2: ProseH2,
  h3: ProseH3,
  pre: ProsePre,
  img: ProseImg,
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

  const children = renderMarkdown<any, VNode>(data.body, h, components)
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
