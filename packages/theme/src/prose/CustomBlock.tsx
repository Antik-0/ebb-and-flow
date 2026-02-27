import type { FunctionalComponent } from 'vue'

interface Props {
  type?: 'info' | 'warning' | 'danger'
  title?: string
}

export const CustomBlock: FunctionalComponent<Props> = (
  props,
  { attrs, slots }
) => {
  const { type = 'info' } = props
  const title = props.title ?? type.toUpperCase()

  return (
    <div class="custom-block" data-type={type} {...attrs}>
      <p class="font-600">{title}</p>
      {slots.default?.()}
    </div>
  )
}
CustomBlock.props = ['type', 'title']
