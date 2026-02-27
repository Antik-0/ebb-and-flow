import type { FunctionalComponent } from 'vue'

interface Props {
  href: string
  target?: string
}

export const ProseA: FunctionalComponent<Props> = (props, { slots }) => {
  const { href, target } = props
  return (
    <a class="ebb-link relative" href={href} target={target}>
      {slots.default?.()}
    </a>
  )
}
