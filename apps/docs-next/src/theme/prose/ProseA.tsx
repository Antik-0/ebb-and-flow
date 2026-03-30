'use client'
import type { PropsWithChildren } from 'react'
import { EbbLink } from '../components/Link'

export function ProseA(props: PropsWithChildren<{ href?: string }>) {
  const { href, children } = props
  return (
    <EbbLink className="ebb-link relative" href={href}>
      {children}
    </EbbLink>
  )
}
