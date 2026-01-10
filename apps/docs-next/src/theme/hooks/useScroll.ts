import { throttle, tryOnIdle } from '@repo/utils'
import { useEffect, useRef, useState } from 'react'
import { useResizeObserver } from './useResizeObserver'

interface ScrollTimelineOptions {
  source?: Element | null
  axis?: ScrollTimelineAxis
}

type ScrollTimelineAxis = 'block' | 'inline' | 'x' | 'y'

interface ScrollTimeline extends AnimationTimeline {
  readonly source: Element | null
  readonly axis: ScrollTimelineAxis
}

declare var ScrollTimeline: {
  new (options?: ScrollTimelineOptions): ScrollTimeline
}

const enableScrollTimeline = () =>
  'ScrollTimeline' in window &&
  window.CSS.supports('animation-timeline: scroll()')

export function useScroll() {
  const [y, setY] = useState(0)
  const [progress, setProgress] = useState(0)

  const raf = useRef<number | undefined>(undefined)
  const stl = useRef<AnimationTimeline | undefined>(undefined)
  const maxScrollTop = useRef(0)

  const { onWindowResize } = useResizeObserver()

  useEffect(() => {
    const animationFrame = () => {
      const _stl = stl.current
      if (!_stl || !_stl.currentTime) return

      const progressVal = (_stl.currentTime as any).value / 100
      setY(maxScrollTop.current * progressVal)
      setProgress(progressVal)
      window.requestAnimationFrame(animationFrame)
    }

    const scrollFrame = throttle(() => {
      const scrollTop = document.documentElement.scrollTop
      setY(scrollTop)
      setProgress(scrollTop / maxScrollTop.current)
    }, 100)

    onWindowResize(() => {
      const root = document.documentElement
      maxScrollTop.current = root.scrollHeight - root.clientHeight
    })

    tryOnIdle(() => {
      if (enableScrollTimeline()) {
        stl.current = new ScrollTimeline({ axis: 'block' })
        raf.current = window.requestAnimationFrame(animationFrame)
      } else {
        window.addEventListener('scroll', scrollFrame)
      }
    })

    return () => {
      raf.current && window.cancelAnimationFrame(raf.current)
      raf.current = undefined
      if (!enableScrollTimeline()) {
        window.removeEventListener('scroll', scrollFrame)
      }
    }
  }, [])

  return { y, progress }
}
