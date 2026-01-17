'use client'
import { useEffect, useRef } from 'react'
import './css-glass.css'

export function CSSGlass() {
  const target = useRef<HTMLDivElement | null>(null)
  const container = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const pressedDelta = { x: 0, y: 0 }

    const targetElement = target.current!
    const containerElement = container.current!

    let targetRect: DOMRect
    let containerRect: DOMRect

    function start(e: PointerEvent) {
      targetRect = targetElement.getBoundingClientRect()
      containerRect = containerElement.getBoundingClientRect()

      pressedDelta.x = e.offsetX
      pressedDelta.y = e.offsetY

      targetElement.style.cursor = 'move'
      document.addEventListener('pointermove', move)
    }

    function end() {
      pressedDelta.x = 0
      pressedDelta.y = 0

      targetElement.style.cursor = ''
      document.removeEventListener('pointermove', move)
    }

    function move(e: PointerEvent) {
      let x = e.clientX - pressedDelta.x - containerRect.left
      x = Math.min(Math.max(0, x), containerRect.width - targetRect.width)

      let y = e.clientY - pressedDelta.y - containerRect.top
      y = Math.min(Math.max(0, y), containerRect.height - targetRect.height)

      targetElement.style.top = y + 'px'
      targetElement.style.left = x + 'px'
    }

    targetElement.addEventListener('pointerdown', start)
    document.addEventListener('pointerup', end)

    return () => {
      targetElement.removeEventListener('pointerdown', start)
      document.removeEventListener('pointerup', end)
    }
  }, [])

  return (
    <div className="glass-container" ref={container}>
      <div className="glass" ref={target}>
        <div className="glass-text">Drag Me</div>
      </div>
    </div>
  )
}
