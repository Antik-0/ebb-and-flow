import type { Plugin } from 'unified'
import type { HAST } from '../types.ts'
import type { Themes } from './shiki.ts'
import { getNodeText, visit } from '../helper.ts'
import { highlighterPromise } from './shiki.ts'

export interface RehypeShikiOptions {
  theme?: Themes
}

/**
 * ✨ 基于 `shiki` 的语法高亮解析
 */
export const rehypeShiki: Plugin<[RehypeShikiOptions], HAST.Root> = options => {
  const { theme = 'vitesse-dark' } = options

  return async ast => {
    const highlighter = await highlighterPromise

    visit<HAST.Element>(
      ast,
      (node, { index, parent, signal }) => {
        if (node.tagName !== 'pre') return

        const codeNode = node.children[0] as HAST.Element

        const className = (codeNode.properties.className as string[]).join(' ')
        const codeMeta = (codeNode.data as any)?.meta ?? ''
        const language = extractLanguage(className)
        const filename = extractFilename(codeMeta)

        let lines = 0
        const codeRaw = getNodeText(codeNode).replaceAll('\r\n', '\n')

        const preHast = highlighter.codeToHast(codeRaw, {
          lang: language ?? 'text',
          theme,
          transformers: [
            {
              line(hast) {
                const [commentNode, parent] = extractInlineComment(hast)
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

        if (parent) {
          parent.children[index] = preHast as any
        }

        return signal.stop
      },
      { type: 'element' }
    )
  }
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
