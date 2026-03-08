import type { Plugin } from 'unified'
import type { MDAST } from '../types/index.ts'
import { toHast } from 'mdast-util-to-hast'

export const remarkToRehype: Plugin = () => {
  return ast => toHast(ast as MDAST.Root)
}
