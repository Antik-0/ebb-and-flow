import type { Data, HAST } from '../types/index.ts'
import { withErrorHandler } from '../shared/error.ts'
import { highlighterPromise } from '../shared/shiki.ts'
import { getNodeText, visit } from '../shared/visit.ts'

export interface RehypeShikiOptions {
  theme?: 'github' | 'vitesse'
}

/**
 * ✨ 基于 `shiki` 的代码高亮解析
 */
export function rehypeShiki(options: RehypeShikiOptions = {}) {
  const { theme = 'vitesse' } = options

  return withErrorHandler<HAST.Root>('rehypeShiki', async ast => {
    const highlighter = await highlighterPromise

    visit<HAST.Element>(
      ast,
      (node, { index, parent, signal }) => {
        if (node.tagName !== 'pre') return

        const codeNode = node.children[0] as HAST.Element
        const props = codeNode.properties
        const className = ((props?.className as string[]) ?? []).join(' ')

        const codeMeta = (codeNode.data as Data)?.meta ?? ''
        const language = extractLanguage(className)
        const filename = extractFilename(codeMeta)

        let lines = 0
        const codeRaw = getNodeText(codeNode).replaceAll('\r\n', '\n')

        const preRoot = highlighter.codeToHast(codeRaw, {
          lang: language ?? 'text',
          themes: {
            light: `${theme}-light`,
            dark: `${theme}-dark`
          },
          defaultColor: false,
          transformers: [
            {
              line(hast, line) {
                Object.assign(hast.properties, { 'data-line': line })

                const [commentNode, parent] = extractInlineComment(
                  hast as HAST.Element
                )
                if (!commentNode) return

                const comment = commentNode.value.trim()
                if (comment === highlightComment) {
                  Object.assign(hast.properties, {
                    'data-highlight': true
                  })
                  // 删除高亮注释节点
                  parent.children.pop()
                }
              },
              code(hast) {
                const last = hast.children.at(-1) as HAST.Element
                if (last.type === 'element' && last.children.length === 0) {
                  // 删除幽灵节点
                  hast.children.pop()
                }
                lines = hast.children.filter(n => n.type === 'element').length
              },
              pre(hast) {
                const props = { code: codeRaw, language, filename, lines }
                Object.assign(hast.properties, props)
              }
            }
          ]
        })
        const preHast = preRoot.children[0]

        if (parent && preHast) {
          parent.children[index] = preHast as any
        }

        return signal.stop
      },
      { type: 'element' }
    )
  })
}

const languagePrefix = 'language-'
const commentPrefix = '//'
const highlightComment = '// [!code highlight]'
const filenameReg = /^\[(.+)\]$/i

function extractLanguage(s: string) {
  if (!s.startsWith(languagePrefix)) return ''
  return s.slice(languagePrefix.length)
}

function extractFilename(s: string) {
  const match = s.trim().match(filenameReg)
  return match?.[1] ?? ''
}

function extractInlineComment(node: HAST.Element) {
  let parent: HAST.Element = node
  let lastnode: HAST.Element | undefined = node

  // 注释只能是行节点的最后一个子节点
  while (lastnode?.children) {
    parent = lastnode
    lastnode = lastnode.children.at(-1) as HAST.Element | undefined
  }

  if (lastnode) {
    // 如果最后一个子节点存在，那么一定是 `Text` 节点
    const textNode = lastnode as unknown as HAST.Text
    const value = textNode.value.trim()
    if (textNode.type === 'text' && value.startsWith(commentPrefix)) {
      return [textNode, parent] as const
    }
  }

  return []
}
