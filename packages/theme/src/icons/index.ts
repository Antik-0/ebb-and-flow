import type { IconifyIconAttributes } from 'iconify-icon'
import type { FunctionalComponent } from 'vue'
import { h } from 'vue'

interface IconProps extends IconifyIconAttributes {}

const Icon: FunctionalComponent<IconProps> = props => {
  return h('iconify-icon', { ...props })
}

export { Icon }

export { default as Atom } from './Atom.vue'
export { default as ChevronRight } from './ChevronRight.vue'
export { default as Menu } from './Menu.vue'
export { default as Power } from './Power.vue'
export { default as Search } from './Search.vue'
