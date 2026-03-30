import type { Props, VNode } from './types/index.ts'

type Hyperscript<C = any, V = any> = (
  tag: string | C,
  props: Props,
  children?: V[] | (() => V[])
) => V

export function renderMarkdown<C = any, V = any>(
  tree: VNode[],
  h: Hyperscript<C, V>,
  components: Record<string, C> = {}
) {
  function render(node: VNode): V {
    if (!node || typeof node === 'string') {
      return node as V
    }

    const [tag, props, children] = node
    const vnodes: V[] = []
    for (const element of children) {
      vnodes.push(render(element))
    }

    const component = components[tag]
    if (component) {
      return h(component, props, () => vnodes)
    } else {
      return h(tag, props, vnodes)
    }
  }

  const children = []
  for (const node of tree) {
    children.push(render(node))
  }
  return children
}

export function renderMarkdownNext<C = any, V = any>(
  tree: VNode[],
  h: Hyperscript<C, V>,
  components: Record<string, C> = {}
) {
  function render(node: VNode, index: number): V {
    if (!node || typeof node === 'string') {
      return node as V
    }

    const [tag, props, children] = node
    const vnodes: V[] = []
    for (let i = 0; i < children.length; i++) {
      const element = children[i]!
      vnodes.push(render(element, i))
    }

    const component = components[tag] ?? tag
    return h(
      component,
      { key: index, ...normalizeReactProps(props) },
      vnodes.length ? vnodes : undefined
    )
  }

  const children = []
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]!
    children.push(render(node, i))
  }
  return children
}

const reactDomPropMap: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  srcset: 'srcSet'
}

function normalizeReactProps(rawProps: Record<string, any>) {
  const props: Record<string, any> = {}

  for (const [rawKey, value] of Object.entries(rawProps)) {
    if (value == null) {
      continue
    }

    const key = normalizePropName(rawKey)
    if (key === 'style') {
      props.style = normalizeStyle(value)
    } else {
      props[key] = value
    }
  }

  return props
}

function normalizePropName(name: string) {
  const mappedName = reactDomPropMap[name]
  if (mappedName) {
    return mappedName
  }

  if (name.startsWith('data-') || name.startsWith('aria-')) {
    return name
  }

  return toCamelCase(name)
}

function normalizeStyle(style: string) {
  const styleObject: Record<string, string> = {}

  for (const item of style.split(';')) {
    const declaration = item.trim()
    if (!declaration) {
      continue
    }

    const separatorIndex = declaration.indexOf(':')
    if (separatorIndex === -1) {
      continue
    }

    const property = declaration.slice(0, separatorIndex).trim()
    const value = declaration.slice(separatorIndex + 1).trim()

    if (!property || !value) {
      continue
    }

    styleObject[normalizeStyleProperty(property)] = value
  }

  return styleObject
}

function normalizeStyleProperty(property: string) {
  if (property.startsWith('--')) {
    return property
  }

  return toCamelCase(property)
}

function toCamelCase(value: string) {
  return value.replaceAll(/-([a-z])/g, (_, char: string) => char.toUpperCase())
}
