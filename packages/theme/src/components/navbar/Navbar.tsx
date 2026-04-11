import { navigateTo } from 'nuxt/app'
import { defineComponent, h } from 'vue'
import { useLayout } from '#/controller/layout'
import { Menu } from '#/icons'
import { useTheme } from '#/theme'
import { Avatar, CubeAvatar, GlassMask } from '../Effect.tsx'
import Menubar from '../menubar/Menubar.tsx'
import SidebarTrigger from '../sidebar/SidebarTrigger.vue'
import ThemeToggle from '../ThemeToggle.vue'
import SocialLinks from './SocialLinks.vue'

export default defineComponent(
  () => {
    const { theme } = useTheme()
    const { isMobile } = useLayout()

    return () => (
      <header
        class="grid-area-[navbar] fixed inset-x-0 top-0 z-[--z-index-navbar] flex flex-center"
        data-role="navbar"
      >
        <div class="cols-[120px_1fr_120px] grid h-[--h-navbar] w-full max-w-320">
          <div class="flex items-center px-4">
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

          <div class="flex items-center justify-end gap-2 pr-4">
            <ThemeToggle />
            <SocialLinks />
          </div>
        </div>

        <GlassMask class="absolute inset-0 -z-1" />
      </header>
    )
  },
  { name: 'Navbar' }
)

function NavbarAction(props: { avatar: string; isMobile: boolean }) {
  const { avatar, isMobile } = props

  if (isMobile) {
    return (
      <SidebarTrigger class="size-10 text-6">
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
