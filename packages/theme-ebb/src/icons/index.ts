import type { IconifyIconAttributes } from 'iconify-icon'
import type { FC } from 'react'
import { createElement } from 'react'
import { builtingLogoIcons } from './logos'

interface IconProps extends IconifyIconAttributes {}

const Icon: FC<IconProps> = props => {
  return createElement('iconify-icon', props)
}

const LogoIconRender: FC<{
  logo: string
}> = props => {
  const { logo, ...restProps } = props
  const icon = builtingLogoIcons[logo]
  return icon ? createElement(icon, { ...restProps }) : null
}

export { Icon, LogoIconRender }

export { default as BookOpen } from './BookOpen'
export { default as ChevronRight } from './ChevronRight.tsx'
export { default as Copy } from './Copy.tsx'
export { default as CopyCheck } from './CopyCheck.tsx'
export { default as EllipsisVertical } from './EllipsisVertical.tsx'
export { default as Github } from './Github.tsx'
export { default as Hash } from './Hash.tsx'
export { default as Menu } from './Menu.tsx'
export { default as PanelLeftClose } from './PanelLeftClose.tsx'
export { default as PanelLeftOpen } from './PanelLeftOpen.tsx'
export { default as Power } from './Power.tsx'
export { default as Rocket } from './Rocket.tsx'
export { default as ThemeDark } from './ThemeDark.tsx'
export { default as ThemeLight } from './ThemeLight.tsx'
