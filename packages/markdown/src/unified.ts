import type { Compiler, Parser } from 'unified'
import type { Data, HAST, Metadata } from './types/index.ts'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { unified } from 'unified'

export function createUnified() {
  const processor = unified()
  processor.parser = ebbParser
  processor.compiler = ebbCompiler
  return processor
}

const ebbParser: Parser = (document, vfile) => {
  const { content, template } = contentSplit(document)
  if (template) {
    try {
      // 解析 frontmatter
      const frontmatter = parseFrontmatter(template)
      vfile.data.frontmatter = frontmatter
    } catch (error) {
      console.error('[frontmatter parse error]' + (error as Error).message)
    }
  }
  // 去除头部的换行符
  const markdown = content.replaceAll(/^(\r?\n)+/g, '')
  return fromMarkdown(markdown)
}

const ebbCompiler: Compiler = (ast, file) => {
  const tree = buildVNodeTree(ast as HAST.Root)
  const metadata = file.data.metadata as Metadata
  const frontmatter = file.data.frontmatter as Data

  console.log({ tree, metadata, frontmatter })

  return ''
}

function contentSplit(content: string): { content: string; template?: string } {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/)
  if (match) {
    const index = match[0].length
    return {
      content: content.slice(index),
      template: match[1]
    }
  }
  return { content }
}

function parseFrontmatter(template: string) {
  template = template.replaceAll('\r\n', '\n')
  const items = template.split('\n')

  function resolveProp(str: string) {
    const prop = {
      key: '',
      value: '',
      level: 0,
      isArray: false
    }
    const length = str.length

    let i = 0
    // 计算缩进等级，2个空格一级
    while (i < length && str[i] === ' ') {
      i += 1
    }
    if (i & 1) {
      // 缩进格式错误
      return null
    }
    prop.level = i / 2

    if (str[i] === '-') {
      // 数组成员
      prop.isArray = true
      prop.value = str.slice(i + 1)
    } else {
      // key: value 形式
      let j = i
      while (j < length && str[j] !== ':') {
        j += 1
      }
      prop.key = str.slice(i, j)
      prop.value = str.slice(j + 1)
    }

    prop.key = prop.key.trim()
    prop.value = prop.value.trim()

    const needParseReg =
      /^(?:true|false|null|undefined|-?\d+(?:\.\d+)?|\{.*\}|\[.*\])/
    if (needParseReg.test(prop.value)) {
      prop.value = JSON.parse(prop.value)
    }

    return prop
  }

  const frontmatter: Record<string, any> = {}
  const keyPaths: (string | number)[] = []
  let levelIndex = 0

  function setProp(
    keys: (string | number)[],
    key: string | number,
    value: any
  ) {
    let target = frontmatter
    for (const key of keys) {
      target = target[key]
    }
    Reflect.set(target, key, value)
  }

  for (const item of items) {
    if (!item) continue
    const prop = resolveProp(item)

    if (prop === null) continue

    const { level, key, value, isArray } = prop
    const keyLevel = level + 1
    const keyLength = keyPaths.length

    if (keyLevel > keyLength) {
      levelIndex = 0
      const parentPath = keyPaths.slice(0, -1)
      const parentKey = keyPaths.at(-1) ?? key
      setProp(parentPath, parentKey, isArray ? [] : {})
    } else if (keyLevel < keyLength) {
      levelIndex = 0
      keyPaths.length = level
    } else {
      levelIndex += 1
      keyPaths.length = level
    }

    const _key = key || levelIndex
    setProp(keyPaths, _key, value)
    keyPaths.push(_key)
  }

  return frontmatter
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
