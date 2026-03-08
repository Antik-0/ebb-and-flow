import type { Compiler, Parser } from 'unified'
import type { HAST, Metadata } from './types/index.ts'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { unified } from 'unified'

export function createUnified() {
  const processor = unified()
  processor.parser = ebbParser
  processor.compiler = ebbCompiler
  return processor
}

const ebbParser: Parser = document => {
  return fromMarkdown(document)
}

const ebbCompiler: Compiler = (ast, file) => {
  const tree = buildVNodeTree(ast as HAST.Root)
  const metadata = file.data.metadata as Metadata

  console.log({ tree, metadata })

  return ''
}

type Props = Record<string, any>
type VNode = string | [string, Props, VNode[]]
type HNode = HAST.Text | HAST.Element | HAST.Comment

function buildVNodeTree(ast: HAST.Root) {
  function transform(node: HNode) {
    if (node.type === 'comment') {
      return undefined
    }
    if (node.type === 'text') {
      if (node.value === '\n') {
        return undefined
      }
      return node.value
    }

    const tag = node.tagName
    const props = node.properties as Props
    const children: VNode[] = []
    if (node.children) {
      for (const element of node.children) {
        const vnode = transform(element)
        if (vnode) {
          children.push(vnode)
        }
      }
    }

    return [tag, props, children] as VNode
  }

  const tree: VNode[] = []
  for (const element of ast.children) {
    const vnode = transform(element as HNode)
    if (vnode) {
      tree.push(vnode)
    }
  }

  return tree
}
