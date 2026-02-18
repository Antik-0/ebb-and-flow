'use client'
import { useRouter } from 'next/navigation'
import { stylex } from '#/utils'
import { EbbAvatar } from '../components/Avatar'
import { useLayout } from '../controller/layout'
import { Menu } from '../icons'
import { useTheme } from '../theme'
import { CubeAvatar } from './CubeAvatar'
import { GlassMask } from './GlassMask'
import { Menubar } from './menubar/Menubar'
import { SocialLinks } from './SocialLinks'
import { SidebarTrigger } from './sidebar/SidebarTrigger'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  return (
    <div
      className="flex flex-center inset-x-0 top-0 fixed z-[--z-index-navbar]"
      data-role="navbar"
    >
      <header className="bg-[--c-bg-navbar] grid cols-[120px_1fr_120px] h-[--h-navbar] max-w-320 w-full">
        <div className="px-6 flex items-center">
          <NavbarBrand />
        </div>

        <div className="flex flex-center">
          <NavbarCenter />
        </div>

        <div className="pr-6 flex items-center justify-between">
          <ThemeToggle />
          <SocialLinks />
        </div>
      </header>

      <GlassMask
        className="inset-0 absolute -z-1"
        style={stylex({ '--fit-size': 'cover' })}
      />
    </div>
  )
}

function NavbarBrand() {
  const router = useRouter()
  const { theme } = useTheme()
  const isMobile = useLayout(state => state.isMobile)

  if (isMobile) {
    return (
      <SidebarTrigger className="text-6 size-10">
        <Menu />
      </SidebarTrigger>
    )
  }

  return (
    <CubeAvatar
      avatar={theme.avatar}
      className="mx-auto"
      onClick={() => router.push('/')}
      style={stylex({ '--size': '40px', '--rounded': '4px' })}
    />
  )
}

function NavbarCenter() {
  const router = useRouter()
  const { theme } = useTheme()
  const isMobile = useLayout(state => state.isMobile)

  if (isMobile) {
    return <EbbAvatar avatar={theme.avatar} onClick={() => router.push('/')} />
  }

  return <Menubar />
}
