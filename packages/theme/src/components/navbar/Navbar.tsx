import { navigateTo } from 'nuxt/app'
import { h } from 'vue'
import { Menu } from '#/icons'
import Avatar from '../Avatar.vue'
import CubeAvatar from '../CubeAvatar.vue'
import Menubar from '../menubar/Menubar.vue'
import SidebarTrigger from '../sidebar/SidebarTrigger.vue'

interface NavbarProps {
  avatar: string
  isMobile: boolean
}

export function NavbarAction(props: NavbarProps) {
  const { isMobile, avatar } = props

  if (isMobile) {
    return h(SidebarTrigger, { class: 'text-6 size-10' }, () => h(Menu))
  }

  return h(CubeAvatar, {
    avatar,
    class: 'mx-auto',
    style: { '--size': '40px', '--rounded': '4px' },
    onClick: () => navigateTo('/')
  })
}

NavbarAction.props = ['avatar', 'isMobile']

export function NavbarContent(props: NavbarProps) {
  const { isMobile, avatar } = props

  if (isMobile) {
    return h(Avatar, {
      avatar: avatar,
      onClick: () => navigateTo('/')
    })
  }

  return h(Menubar)
}

NavbarContent.props = ['avatar', 'isMobile']
