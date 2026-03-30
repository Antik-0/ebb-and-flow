import type { LinkProps as NextLinkProps } from 'next/link'
import type { PropsWithChildren } from 'react'
import type { WithHTMLProps } from '../types'
import { isExternalLink, isString } from '@repo/utils'
import NextLink from 'next/link'

interface EbbLinkProps
  extends Omit<NextLinkProps, 'href'>,
    WithHTMLProps<HTMLAnchorElement> {
  href?: NextLinkProps['href']
}

export function EbbLink(props: PropsWithChildren<EbbLinkProps>) {
  const {
    href,
    replace,
    scroll,
    prefetch,
    onNavigate,
    children,
    rel,
    ...attrs
  } = props

  const _href = isString(href) ? href : (href?.pathname ?? '')
  const isExternal = isExternalLink(_href)
  const target = isExternal ? '_blank' : undefined
  const ref = isExternal ? 'noreferrer' : undefined

  if (isExternal) {
    return (
      <a href={_href} rel={ref} target={target} {...attrs}>
        {children}
      </a>
    )
  }

  return (
    <NextLink
      href={_href}
      onNavigate={onNavigate}
      prefetch={prefetch}
      rel={rel}
      replace={replace}
      scroll={scroll}
      target={target}
      {...attrs}
    >
      {children}
    </NextLink>
  )
}
