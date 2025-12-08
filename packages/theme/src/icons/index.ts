import type { IconifyIconAttributes } from 'iconify-icon'
import type { FunctionalComponent } from 'vue'
import { h } from 'vue'
import { builtingLogoIcons } from './logo'

interface IconProps extends IconifyIconAttributes {}

const Icon: FunctionalComponent<IconProps> = props => {
  return h('iconify-icon', { ...props })
}

const LogoIconRender: FunctionalComponent<{
  logo: string
}> = props => {
  const { logo, ...restProps } = props
  const icon = builtingLogoIcons[logo]
  return icon ? h(icon, { ...restProps }) : null
}

export { Icon, LogoIconRender }

export { default as BookOpen } from './BookOpen.vue'
export { default as ChevronRight } from './ChevronRight.vue'
export { default as Copy } from './Copy.vue'
export { default as CopyCheck } from './CopyCheck.vue'
export { default as Github } from './Github.vue'
export { default as Hash } from './Hash.vue'
export { default as Menu } from './Menu.vue'
export { default as PanelLeftClose } from './PanelLeftClose.vue'
export { default as PanelLeftOpen } from './PanelLeftOpen.vue'
export { default as Power } from './Power.vue'
export { default as Rocket } from './Rocket.vue'
export { default as ThemeDark } from './ThemeDark.vue'
export { default as ThemeLight } from './ThemeLight.vue'
