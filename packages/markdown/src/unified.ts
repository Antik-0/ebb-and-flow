import type { Compiler, Parser, Pluggable, Plugin } from 'unified'
import type { HAST, VFileData } from './types/index.ts'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { unified } from 'unified'
import { rehypePatch } from './rehype/patch.ts'
import { rehypeShiki } from './rehype/shiki.ts'
import { remarkComponent } from './remark/component.ts'
import { remarkMetadata } from './remark/metadata.ts'
import { remarkToRehype } from './remark/to-hast.ts'
import { createVNodeTree } from './shared/vnode.ts'

const remarkPlugins = [
  [remarkComponent],
  [remarkMetadata],
  [remarkToRehype]
] as Pluggable[]
const rehypePlugins = [[rehypeShiki], [rehypePatch]] as Pluggable[]

/**
 * ✨ 创建 `unified` 处理器
 */
export function createUnified() {
  const processor = unified()
  processor.parser = ebbParser
  processor.compiler = ebbCompiler

  const plguins = [...remarkPlugins, ...rehypePlugins]
  for (const plugin of plguins) {
    processor.use(plugin as Plugin)
  }

  return processor
}

/**
 * ✨ `unified.parser`
 */
const ebbParser: Parser = (document, vfile) => {
  const frontmatterReg = /^---\r?\n([\s\S]+?)\r?\n---/

  const match = document.match(frontmatterReg)
  if (match) {
    const index = match[0].length
    document = document.slice(index)
    try {
      // 解析 frontmatter
      vfile.data.frontmatter = Bun.YAML.parse(match[1]!)
    } catch (error) {
      throw new Error('[Markdown Parse Error]: ' + (error as Error).message)
    }
  }

  // 去除头部的换行符
  const markdown = document.replaceAll(/^(\r?\n)+/g, '')
  return fromMarkdown(markdown)
}

/**
 * ✨ `unified.compiler`
 */
const ebbCompiler: Compiler = (ast, file) => {
  try {
    // 转换为虚拟dom树，便于客户端渲染
    const body = createVNodeTree(ast as HAST.Root)

    const fileData = file.data as unknown as VFileData
    const { metadata, frontmatter } = fileData

    return { body, metadata, frontmatter }
  } catch (error) {
    throw new Error('[Markdown Compiler Error]: ' + (error as Error).message)
  }
}
