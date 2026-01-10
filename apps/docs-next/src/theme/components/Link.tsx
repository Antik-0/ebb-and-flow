import type { LinkProps as NextLinkProps } from 'next/link'
import type { PropsWithChildren } from 'react'
import type { WithHTMLProps } from '../types'
import { isExternalLink, isString } from '@repo/utils'
import NextLink from 'next/link'

interface LinkProps extends NextLinkProps, WithHTMLProps<HTMLAnchorElement> {
  tag?: string
  target?: string
}

export function EbbLink(props: PropsWithChildren<LinkProps>) {
  const {
    href,
    replace,
    scroll,
    prefetch,
    onNavigate,
    children,
    tag,
    rel,
    target,
    ...restProps
  } = props

  const _href = isString(href) ? href : href.pathname
  const isExternal = _href && isExternalLink(_href)

  const _rel = isExternal ? 'noreferrer' : rel
  const _target = isExternal ? '_blank' : target

  if (isExternal) {
    return (
      <a href={_href} rel={_rel} target={_target} {...restProps}>
        {children}
      </a>
    )
  }

  return (
    <NextLink
      href={href}
      onNavigate={onNavigate}
      prefetch={prefetch}
      rel={_rel}
      replace={replace}
      scroll={scroll}
      target={_target}
      {...restProps}
    />
  )
}
