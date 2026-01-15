'use client'
import type { PropsWithChildren } from 'react'
import { EbbLink } from '../components/Link'

interface Props {
  href: string
  target?: string
}

export function ProseA(props: PropsWithChildren<Props>) {
  const { href, target, children } = props
  return (
    <EbbLink className="ebb-link relative" href={href} target={target}>
      {children}
    </EbbLink>
  )
}
