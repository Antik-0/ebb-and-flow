import type { MarkdownData } from 'ebb-markdown'
import type { FunctionComponent, ReactNode } from 'react'
import { renderMarkdownNext } from 'ebb-markdown/render'
import { createElement } from 'react'
import {
  ColorfulBorder,
  GridMotion,
  PlayonMotion,
  SvgLoading,
  SvgSpinner
} from './components/CssEffect'
import { CssGlass } from './components/CssGlass'
import {
  CodeGroup,
  CustomBlock,
  PageMeta,
  ProseA,
  ProseH2,
  ProseH3,
  ProseImg,
  ProsePre
} from './theme/prose'

const components = {
  a: ProseA,
  h2: ProseH2,
  h3: ProseH3,
  img: ProseImg,
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
} satisfies Record<string, FunctionComponent<any>>

interface ContentProps {
  data?: MarkdownData | null
  path?: string
}

export function ContentRender({ path, data }: ContentProps) {
  if (!data) return null

  const children = renderMarkdownNext<FunctionComponent<any>, ReactNode>(
    data.body,
    createElement as any,
    components
  )

  return createElement(
    'div',
    {
      'data-path': path,
      'data-role': 'markdown'
    },
    children
  )
}
