'use client'
import type { WithHTMLProps } from '../types'
import { AnchorHead } from './AnchorHead'

interface Props extends WithHTMLProps<HTMLHeadingElement> {
  id?: string
}

export function ProseH3(props: Props) {
  const { id, children, ...attrs } = props
  return (
    <AnchorHead id={id} tag="h3" {...attrs}>
      {children}
    </AnchorHead>
  )
}
