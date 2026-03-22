import type { MarkdownData } from 'ebb-markdown'
import type { FunctionComponent, ReactNode } from 'react'
import { renderMarkdown } from 'ebb-markdown/render'
import { createElement } from 'react'
import {
  CodeGroup,
  CustomBlock,
  PageMeta,
  ProseA,
  ProseH2,
  ProseH3,
  ProsePre
} from './theme/prose'

const components = {
  a: ProseA,
  h2: ProseH2,
  h3: ProseH3,
  pre: ProsePre,
  PageMeta,
  CodeGroup,
  CustomBlock
} satisfies Record<string, FunctionComponent<any>>

interface ContentProps {
  data?: MarkdownData | null
  path?: string
}

export function ContentRender({ path, data }: ContentProps) {
  if (!data) return null

  const children = renderMarkdown<FunctionComponent<any>, ReactNode>(
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
