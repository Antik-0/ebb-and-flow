'use client'
import type { PropsWithChildren } from 'react'

interface Props {
  type?: 'info' | 'warning' | 'danger'
  title?: string
}

export function CustomBlock(props: PropsWithChildren<Props>) {
  const { type = 'info', children } = props
  const title = props.title ?? type.toUpperCase()

  return (
    <div className="custom-block" data-type={type}>
      <p className="font-600">{title}</p>
      {children}
    </div>
  )
}
