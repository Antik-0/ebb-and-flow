import { defineComponent, h, inject } from 'vue'
import CodeGroup from './CodeGroup.vue'

export interface CodeBlockProps {
  code?: string
  language?: string
  filename?: string
  highlights?: (() => number[])[]
  meta?: string
  class?: string
}

export const CodeBlock = defineComponent<CodeBlockProps>({
  name: 'CodeBlock',
  setup(props, { attrs, slots }) {
    const ctx = inject('code-group', null)
    const isGrouped = ctx !== null

    const rawPreVnode = () =>
      h(
        'pre',
        {
          class: props.class,
          ...attrs
        },
        slots.default?.()
      )

    if (isGrouped) {
      return rawPreVnode
    }

    return () =>
      h(
        CodeGroup,
        { single: true },
        // 这里需要显示传入 props 给 vnode
        () => h(rawPreVnode, { ...props })
      )
  },
  props: ['code', 'language', 'filename', 'highlights', 'meta', 'class']
})
