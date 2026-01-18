import { throttle } from '@repo/utils'
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import { usePageData } from './layout'

export function useOutline() {
  const anchors = usePageData(state => state.toc)

  const [activeIndex, setActiveIndex] = useState(-1)
  const offsetTopMap = useRef<number[]>([])

  const createOffsetTopMap = useCallback(() => {
    const container = document.getElementById('ebb-content')
    if (!container) return []

    const result: number[] = []
    try {
      for (const anchor of anchors) {
        const node = container.querySelector(anchor.to)
        if (node) {
          result.push(calcOffsetTop(node as HTMLElement))
        }
      }
    } catch (error) {
      console.log(error)
    }
    return result
  }, [anchors])

  const computeActivedAnchor = useEffectEvent(() => {
    const root = document.documentElement
    const scrollTop = root.scrollTop
    const scrollHeight = root.scrollHeight

    if (scrollTop + window.innerHeight + 10 > scrollHeight) {
      setActiveIndex(anchors.length - 1)
      return
    }

    let activated = -1
    for (const [index, offsetTop] of offsetTopMap.current.entries()) {
      if (offsetTop - scrollTop <= 200) {
        activated = index
      } else {
        break
      }
    }

    setActiveIndex(activated)
  })

  useEffect(() => {
    offsetTopMap.current = createOffsetTopMap()
    computeActivedAnchor()
    return () => {
      offsetTopMap.current = []
    }
  }, [anchors])

  useEffect(() => {
    const throttled = throttle(computeActivedAnchor, 100)
    window.addEventListener('scroll', throttled)
    return () => window.removeEventListener('scroll', throttled)
  }, [])

  return { anchors, activeIndex }
}

function calcOffsetTop(node: HTMLElement) {
  let offsetTop = 0
  while (node) {
    offsetTop += node.offsetTop
    node = node.offsetParent as HTMLElement
  }
  return offsetTop
}
