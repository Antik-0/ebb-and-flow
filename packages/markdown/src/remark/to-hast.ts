import type { HAST, MDAST } from '../types/index.ts'
import { fromHtml } from 'hast-util-from-html'
import { toHast } from 'mdast-util-to-hast'
import { withErrorHandler } from '../shared/error.ts'
import { visit } from '../shared/visit.ts'

export function remarkToRehype() {
  return withErrorHandler<MDAST.Root>('remarkToRehype', ast =>
    toHast(ast, {
      allowDangerousHtml: true,
      handlers: {
        html: (_, node) => {
          const hastNode = transform(node.value)
          return hastNode ?? node
        }
      }
    })
  )
}

function transform(raw: string) {
  const hast = fromHtml(raw)

  let target: HAST.Element | undefined
  visit<HAST.Element>(hast, (node, { signal }) => {
    if (node.tagName === 'style') {
      target = node
      return signal.RETURN
    }
    if (node.tagName === 'body') {
      target = node.children?.[0] as HAST.Element
      return signal.RETURN
    }
    return
  })

  return target
}
