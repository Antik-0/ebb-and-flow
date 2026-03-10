import type { MDAST } from '../types/index.ts'
import { toHast } from 'mdast-util-to-hast'
import { withErrorHandler } from '../shared/error.ts'

export function remarkToRehype() {
  return withErrorHandler<MDAST.Root>('remarkToRehype', ast => toHast(ast))
}
