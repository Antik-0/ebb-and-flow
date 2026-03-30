import type { SetupContext } from 'vue'

interface Props {
  type?: 'info' | 'warning' | 'danger'
  title?: string
}

export function CustomBlock(props: Props, { slots }: SetupContext) {
  const { type = 'info' } = props
  const title = props.title ?? type.toUpperCase()

  return (
    <div class="custom-block" data-type={type}>
      <p class="font-600">{title}</p>
      {slots.default?.()}
    </div>
  )
}
