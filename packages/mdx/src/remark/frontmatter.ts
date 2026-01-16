import type { Plugin } from 'unified'
import type { MDAST } from '../types.ts'
import { getNodeText } from '../shared/visit.ts'

/**
 * ✨ 定义 `.mdx` 文件 `frontmatter`
 */
export const remarkFrontmatter: Plugin<[], MDAST.Root> = () => {
  return (root, file) => {
    const children = root.children
    const matterType = 'thematicBreak'

    const firstNode = children[0]

    if (firstNode?.type !== matterType) {
      // '---' 标识必须在文件顶层
      return
    }

    let endIndex = 0
    for (let i = 1; i < children.length; i++) {
      const node = children[i] as any

      if (
        node.type === matterType ||
        (node.type === 'heading' && node.depth === 2)
      ) {
        // 注意如果 '---' 上方紧邻文字，会被解析成 h2 标签
        endIndex = i + 1
        break
      }
    }

    if (endIndex === 0) {
      // 没有匹配到成对的 '---' 标识符
      return
    }

    const matters = Object.create(null)

    for (let i = 1; i < endIndex; i++) {
      const node = children[i] as any
      if (node.type === matterType) {
        continue
      }
      const str = getNodeText(node)
      const entry = parseEntry(str)
      if (entry) {
        Object.assign(matters, entry)
      } else {
        console.error(`[remarkFrontmatter Error]: Unable to parse \`${str}\``)
      }
    }

    file.data.matters = matters

    // 截断, 删除 matter 信息
    root.children = root.children.slice(endIndex)
  }
}

function parseEntry(str: string) {
  try {
    const [k, v] = str.split(':')
    if (!k || !v) return null

    const key = k.trim()
    const value = v.trim()
    const objStr = `{"${key}": ${value}}`.replaceAll("'", '"')
    const res = JSON.parse(objStr)
    return res
  } catch {
    return null
  }
}
