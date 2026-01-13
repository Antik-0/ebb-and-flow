import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import { useIntersectionObserver } from '../hooks'

interface Props {
  top?: number
  bottom?: number
  onVisibleChange?: (visible: boolean) => void
}

export function ViewportSentinel(props: Props) {
  const { top, bottom, onVisibleChange } = props

  const sentinel = useRef<HTMLDivElement | null>(null)
  const { observe } = useIntersectionObserver()

  useEffect(() => {
    observe(sentinel.current, entry => {
      onVisibleChange?.(entry.isIntersecting)
    })
  }, [])

  const style: CSSProperties = {}
  if (top) {
    style.top = top + 'px'
  } else if (bottom) {
    style.bottom = bottom + 'px'
  }

  return (
    <div
      aria-hidden="true"
      className="h-1 inset-x-0 absolute -z-1"
      data-role="sentinel"
      ref={sentinel}
      style={style}
    ></div>
  )
}
