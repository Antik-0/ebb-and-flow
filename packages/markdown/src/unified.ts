import type { Compiler, Parser, Pluggable, Plugin } from 'unified'
import type { HAST, VFileData } from './types/index.ts'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { unified } from 'unified'
import { parseFrontmatter } from './shared/frontmatter.ts'
import { createVNodeTree } from './shared/vnode.ts'

interface UnifiedOptions {
  remarkPlugins?: Pluggable[]
  rehypePlugins?: Pluggable[]
}

/**
 * ✨ 创建 `unified` 处理器
 */
export function createUnified(options: UnifiedOptions = {}) {
  const { remarkPlugins = [], rehypePlugins = [] } = options
  const plguins = [...remarkPlugins, ...rehypePlugins]

  const processor = unified()
  processor.parser = ebbParser
  processor.compiler = ebbCompiler

  for (const plugin of plguins) {
    processor.use(plugin as Plugin)
  }

  return processor
}

/**
 * ✨ `unified.parser`
 */
const ebbParser: Parser = (document, vfile) => {
  const { content, template } = contentSplit(document)
  if (template) {
    try {
      // 解析 frontmatter
      const frontmatter = parseFrontmatter(template)
      vfile.data.frontmatter = frontmatter
    } catch (error) {
      throw new Error('[Markdown Parse Error]: ' + (error as Error).message)
    }
  }
  // 去除头部的换行符
  const markdown = content.replaceAll(/^(\r?\n)+/g, '')
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

const frontmatterReg = /^---\r?\n([\s\S]+?)\r?\n---/

function contentSplit(content: string): { content: string; template?: string } {
  const match = content.match(frontmatterReg)
  if (match) {
    const index = match[0].length
    return {
      content: content.slice(index),
      template: match[1]
    }
  }
  return { content }
}
