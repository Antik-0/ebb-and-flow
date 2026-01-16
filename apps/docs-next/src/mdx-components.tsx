import type { MDXComponents } from 'mdx/types'
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
  CustomBlock
}

export function useMDXComponents(): MDXComponents {
  return components
}
