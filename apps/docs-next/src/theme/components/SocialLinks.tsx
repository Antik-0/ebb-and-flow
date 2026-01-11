import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Github } from '../icons'
import { useTheme } from '../theme'
import { EbbLink } from './Link'

const logoMap: Record<string, ReactNode> = {
  github: <Github />
}

export function SocialLinks() {
  const { theme } = useTheme()

  const socialLinks = useMemo(
    () =>
      theme.socialLinks
        ?.filter(item => item.icon in logoMap)
        .map(item => ({
          label: item.icon,
          link: item.link,
          icon: logoMap[item.icon]!
        })) ?? [],
    [theme]
  )

  return (
    <div className="flex gap-2">
      {socialLinks.map(item => (
        <EbbLink
          aria-label={item.label}
          className="text-6 flex size-9 cursor-pointer flex-center"
          href={item.link}
          key={item.label}
        >
          {item.icon}
        </EbbLink>
      ))}
    </div>
  )
}
