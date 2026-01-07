import { tryOnIdle } from '@repo/utils'
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { useResizeObserver } from './useResizeObserver.ts'

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
  const y = shallowRef(0)
  const progress = shallowRef(0)

  let raf: number | undefined
  let stl: AnimationTimeline
  let maxScrollTop = 0

  const { onWindowResize } = useResizeObserver()

  const animationFrame = () => {
    if (!stl || !stl.currentTime) return

    progress.value = (stl.currentTime as any).value / 100
    y.value = maxScrollTop * progress.value
    window.requestAnimationFrame(animationFrame)
  }

  const scrollFrame = () => {
    y.value = document.documentElement.scrollTop
    progress.value = y.value / maxScrollTop
  }

  onMounted(() => {
    onWindowResize(() => {
      const root = document.documentElement
      maxScrollTop = root.scrollHeight - root.clientHeight
    })

    tryOnIdle(() => {
      if (enableScrollTimeline()) {
        stl = new ScrollTimeline({ axis: 'block' })
        raf = window.requestAnimationFrame(animationFrame)
      } else {
        window.addEventListener('scroll', scrollFrame)
      }
    })
  })

  onBeforeUnmount(() => {
    raf && window.cancelAnimationFrame(raf)
    raf = undefined
    if (!enableScrollTimeline()) {
      window.removeEventListener('scroll', scrollFrame)
    }
  })

  return { y, progress }
}
