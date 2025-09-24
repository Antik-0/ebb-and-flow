import type { IconifyIconAttributes } from 'iconify-icon'
import type { FunctionalComponent } from 'vue'
import { h } from 'vue'

interface IconProps extends IconifyIconAttributes {}

const Icon: FunctionalComponent<IconProps> = props => {
  return h('iconify-icon', { ...props })
}

export { Icon }
