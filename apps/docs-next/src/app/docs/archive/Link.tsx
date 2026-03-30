'use client'
import type { PropsWithChildren } from 'react'
import { EbbLink } from '#/theme/components/Link'
import { withViewTransition } from '#/utils'

export function TransitionLink(props: PropsWithChildren<{ to: string }>) {
  const { to, children } = props

  function onNavigate() {
    withViewTransition('/archive', '')
  }

  return (
    <EbbLink className="card relative" href={to} onNavigate={onNavigate}>
      {children}
    </EbbLink>
  )
}
