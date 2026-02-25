import { navigateTo } from 'nuxt/app'
import { defineComponent, h } from 'vue'
import { useLayoutCtx } from '#/controller/layout'
import { Menu } from '#/icons'
import { useTheme } from '#/theme'
import Avatar from '../Avatar.vue'
import CubeAvatar from '../CubeAvatar.vue'
import GlassMask from '../GlassMask.vue'
import Menubar from '../menubar/Menubar.tsx'
import SidebarTrigger from '../sidebar/SidebarTrigger.vue'
import ThemeToggle from '../ThemeToggle.vue'
import SocialLinks from './SocialLinks.vue'

export default defineComponent(
  () => {
    const { theme } = useTheme()
    const { isMobile } = useLayoutCtx()

    return () => (
      <header
        class="flex grid-area-[navbar] flex-center inset-x-0 top-0 fixed z-[--z-index-navbar]"
        data-role="navbar"
      >
        <div class="bg-[--c-bg-navbar] grid cols-[120px_1fr_120px] h-[--h-navbar] max-w-320 w-full">
          <div class="px-6 flex items-center">
            <NavbarAction avatar={theme.avatar} isMobile={isMobile.value} />
          </div>

          <div class="flex flex-center">
            <Avatar
              avatar={theme.avatar}
              data-role="site-logo"
              onClick={() => navigateTo('/')}
            />
            <Menubar />
          </div>

          <div class="pr-6 flex items-center justify-between">
            <ThemeToggle />
            <SocialLinks />
          </div>
        </div>

        <GlassMask class="inset-0 absolute -z-1" style="--fit-size: cover" />
      </header>
    )
  },
  { name: 'Navbar' }
)

function NavbarAction(props: { avatar: string; isMobile: boolean }) {
  const { isMobile, avatar } = props

  if (isMobile) {
    return (
      <SidebarTrigger class="text-6 size-10">
        <Menu />
      </SidebarTrigger>
    )
  }

  return h(CubeAvatar, {
    avatar,
    class: 'mx-auto',
    style: { '--size': '40px', '--rounded': '4px' },
    onClick: () => navigateTo('/')
  })
}
NavbarAction.props = ['avatar', 'isMobile']
