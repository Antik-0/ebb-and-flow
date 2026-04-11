'use client'
import { useRouter } from 'next/navigation'
import { stylex, withViewTransition } from '#/utils'
import { useLayout } from '../controller/layout'
import { Menu } from '../icons'
import { useTheme } from '../theme'
import { Avatar, CubeAvatar, GlassMask } from './Effect'
import { Menubar } from './menubar/Menubar'
import { SocialLinks } from './SocialLinks'
import { SidebarTrigger } from './sidebar/SidebarTrigger'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  return (
    <div
      className="grid-area-[navbar] fixed inset-x-0 top-0 z-[--z-index-navbar] flex flex-center"
      data-role="navbar"
    >
      <header className="cols-[120px_1fr_120px] grid h-[--h-navbar] w-full max-w-320">
        <div className="flex items-center px-4">
          <NavbarAction />
        </div>

        <div className="flex flex-center">
          <NavbarCenter />
        </div>

        <div className="flex items-center justify-end gap-2 pr-4">
          <ThemeToggle />
          <SocialLinks />
        </div>
      </header>

      <GlassMask className="absolute inset-0 -z-1" />
    </div>
  )
}

function NavbarAction() {
  const { theme } = useTheme()
  const isMobile = useLayout(state => state.isMobile)

  const router = useRouter()

  function handleClick() {
    withViewTransition('', '/')
    router.push('/')
  }

  if (isMobile) {
    return (
      <SidebarTrigger className="size-10 text-6">
        <Menu />
      </SidebarTrigger>
    )
  }

  return (
    <CubeAvatar
      avatar={theme.avatar}
      className="mx-auto"
      onClick={handleClick}
      style={stylex({ '--size': '40px', '--rounded': '4px' })}
    />
  )
}

function NavbarCenter() {
  const { theme } = useTheme()
  const router = useRouter()

  function handleClick() {
    withViewTransition('', '/')
    router.push('/')
  }

  return (
    <>
      <Avatar
        avatar={theme.avatar}
        data-role="site-logo"
        onClick={handleClick}
      />
      <Menubar />
    </>
  )
}
