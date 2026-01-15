'use client'
import type { WithHTMLProps } from '../types'
import { AnchorHead } from './AnchorHead'

interface Props extends WithHTMLProps<HTMLHeadingElement> {
  id?: string
}

export function ProseH2(props: Props) {
  const { id, children, ...attrs } = props
  return (
    <AnchorHead id={id} tag="h2" {...attrs}>
      {children}
    </AnchorHead>
  )
}
