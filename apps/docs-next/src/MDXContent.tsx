import type { MDXComponents } from 'mdx/types'
import { createElement } from 'react'
import { CSSGlass } from './content/components/css-glass'
import { SVGLoading } from './content/components/svg-loading'
import {
  CodeGroup,
  CustomBlock,
  PageMeta,
  ProseA,
  ProseH2,
  ProseH3,
  ProsePre
} from './theme/prose'

const components: MDXComponents = {
  a: ProseA,
  h2: ProseH2,
  h3: ProseH3,
  pre: ProsePre,
  PageMeta,
  CodeGroup,
  CustomBlock,
  CSSGlass,
  SVGLoading
}

type Content = React.FunctionComponent<{ components: MDXComponents }>

export const MDXContent = ({ content }: { content: Content }) => {
  return createElement(content, { components })
}
