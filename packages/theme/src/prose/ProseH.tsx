import type { FunctionalComponent } from 'vue'
import { clsx } from '@repo/utils'
import { h } from 'vue'
import { Hash } from '#/icons'

export const ProseH2: FunctionalComponent<{ id?: string }> = (
  props,
  { attrs, slots }
) => {
  return (
    <AnchorHead id={props.id} tag="h2" {...attrs}>
      {slots.default?.()}
    </AnchorHead>
  )
}
ProseH2.props = ['id']

export const ProseH3: FunctionalComponent<{ id?: string }> = (
  props,
  { attrs, slots }
) => {
  return (
    <AnchorHead id={props.id} tag="h3" {...attrs}>
      {slots.default?.()}
    </AnchorHead>
  )
}
ProseH3.props = ['id']

interface Props {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  id?: string
}

const AnchorHead: FunctionalComponent<Props> = (
  props: Props,
  { attrs, slots }
) => {
  const { tag, id } = props

  return h(
    tag,
    { id, ...attrs },
    h(Anchor, { id }, { default: () => slots.default?.() })
  )
}
AnchorHead.props = ['tag', 'id']

const Anchor: FunctionalComponent<{ id?: string }> = (props, { slots }) => {
  const { id } = props
  const children = slots.default?.()

  return (
    <a class="group inline-flex items-center relative" href={`#${id}`}>
      <span
        class={clsx(
          'rounded-md flex size-5 cursor-pointer flex-center absolute',
          'text-muted-foreground bg-muted duration-250 hover:text-brand',
          'opacity-0 transition-opacity group-hover:opacity-100'
        )}
      >
        <Hash />
      </span>
      <span class="transition-transform duration-250 group-hover:translate-x-6">
        {children}
      </span>
    </a>
  )
}
Anchor.props = ['id']
