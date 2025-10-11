import type { InjectionKey, ShallowRef } from 'vue'
import { useData } from 'vitepress'
import {
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  watch
} from 'vue'

interface Anchor {
  text: string
  to: string
  level: number
  offsetTop: number
}

interface OutlineContext {
  anchors: ShallowRef<Anchor[]>
  activeIndex: ShallowRef<number>
}

const OutlineCtx = Symbol() as InjectionKey<OutlineContext>

export function useOutline() {
  let observer: IntersectionObserver

  const anchors = shallowRef<Anchor[]>([])
  const activeIndex = shallowRef(-1)

  function createOutlineAnchors() {
    const content = document.getElementById('content')
    if (!content) return

    observer.disconnect()
    const elements = content.querySelectorAll<HTMLElement>('h2,h3')

    const data: Anchor[] = []
    for (const element of elements) {
      const offsetTop = calcOffsetTop(element)
      data.push({
        text: element.id,
        to: `#${element.id}`,
        level: Number(element.tagName.at(-1)) - 2,
        offsetTop
      })

      observer.observe(element)
    }
    const bottomSentry = document.getElementById('bottom-sentry')
    observer.observe(bottomSentry!)

    anchors.value = data
  }

  function calcOffsetTop(node: HTMLElement) {
    let offsetTop = 0
    while (node) {
      offsetTop += node.offsetTop
      node = node.offsetParent as HTMLElement
    }
    return offsetTop
  }

  const { page } = useData()

  watch(page, createOutlineAnchors, { flush: 'post' })

  onMounted(async () => {
    await nextTick()
    createObserver()
    createOutlineAnchors()
  })

  onBeforeUnmount(() => {
    observer.disconnect()
    observer = null as any
  })

  function createObserver() {
    observer = new IntersectionObserver(computeActivedAnchor, {
      rootMargin: '-200px 0px 0px 0px'
    })
  }

  function computeActivedAnchor(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (entry.target.id === 'bottom-sentry' && entry.isIntersecting) {
        activeIndex.value = anchors.value.length - 1
        return
      }
    }

    const scrollTop = document.documentElement.scrollTop

    let activated = -1
    for (const [index, anchor] of anchors.value.entries()) {
      if (anchor.offsetTop - scrollTop <= 200) {
        activated = index
      } else {
        break
      }
    }

    activeIndex.value = activated
  }

  provide(OutlineCtx, { anchors, activeIndex })
}

export function useOutlineCtx() {
  return inject(OutlineCtx)!
}
