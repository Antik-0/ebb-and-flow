'use client'
import type { PropsWithChildren } from 'react'
import type { WithHTMLProps } from '../types'
import { clsx } from '@repo/utils'
import { createElement } from 'react'
import { Hash } from '../icons'

interface Props extends WithHTMLProps<HTMLHeadingElement> {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  id?: string
}

export function AnchorHead(props: PropsWithChildren<Props>) {
  const { tag, id, children, ...attrs } = props
  return createElement(tag, { id, ...attrs }, <Anchor>{children}</Anchor>)
}

function Anchor(props: PropsWithChildren<{ id?: string }>) {
  const { id = '', children } = props
  return (
    <a className="group inline-flex items-center relative" href={`#${id}`}>
      <span
        className={clsx(
          'rounded-md flex size-5 cursor-pointer flex-center absolute',
          'text-muted-foreground bg-muted duration-250 hover:text-brand',
          'opacity-0 transition-opacity group-hover:opacity-100'
        )}
      >
        <Hash />
      </span>
      <span className="transition-transform duration-250 group-hover:translate-x-6">
        {children}
      </span>
    </a>
  )
}
