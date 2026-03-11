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
    if (typeof node === 'string') {
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
