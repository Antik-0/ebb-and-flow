import type { FunctionalComponent, SetupContext } from 'vue'
import { clsx } from '@repo/utils'
import { h } from 'vue'
import { Hash } from '#/icons'

interface HeadingProps {
  id?: string
}

export function ProseH2(props: HeadingProps, { slots }: SetupContext) {
  const { id, ...attrs } = props
  return (
    <AnchorHead id={id} tag="h2" {...attrs}>
      {slots.default?.()}
    </AnchorHead>
  )
}

export function ProseH3(props: HeadingProps, { slots }: SetupContext) {
  const { id, ...attrs } = props
  return (
    <AnchorHead id={id} tag="h3" {...attrs}>
      {slots.default?.()}
    </AnchorHead>
  )
}

interface Props extends HeadingProps {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

function AnchorHead(props: Props, { slots }: SetupContext) {
  const { tag, id, ...attrs } = props

  return h(
    tag,
    { id, ...attrs },
    h(Anchor, { id }, { default: () => slots.default?.() })
  )
}

const Anchor: FunctionalComponent<HeadingProps> = (props, { slots }) => {
  return (
    <a class="group relative inline-flex items-center" href={`#${props.id}`}>
      <span
        class={clsx(
          'absolute flex size-5 flex-center cursor-pointer rounded-md',
          'bg-muted text-muted-foreground duration-300 hover:text-brand',
          'opacity-0 transition-opacity group-hover:opacity-100'
        )}
      >
        <Hash />
      </span>
      <span class="transition-transform duration-300 group-hover:translate-x-6">
        {slots.default?.()}
      </span>
    </a>
  )
}
