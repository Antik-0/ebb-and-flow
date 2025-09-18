import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, onMounted, toValue } from 'vue'

type Callback = (entry: IntersectionObserverEntry, target: Element) => void

let observer: IntersectionObserver | null = null
let observedCount = 0
const callbackMap = new WeakMap<Element, Callback>()

function createIntersectionObserver() {
  return new IntersectionObserver(entries => {
    for (const entry of entries) {
      const target = entry.target
      if (callbackMap.has(target)) {
        const callback = callbackMap.get(target)
        callback?.(entry, target)
      }
    }
  })
}

function addobserve(target: Element, callback: Callback) {
  if (observer === null) {
    observer = createIntersectionObserver()
  }

  if (!callbackMap.has(target)) {
    observer.observe(target)
  }
  callbackMap.set(target, callback)
  observedCount += 1
}

function unobserve(target: Element) {
  if (!callbackMap.has(target) || !observer) {
    return
  }

  observer.unobserve(target)
  callbackMap.delete(target)
  observedCount -= 1

  if (observedCount === 0) {
    observer.disconnect()
  }
}

interface ObserveEntry {
  target: MaybeRefOrGetter<Element | null>
  callback: Callback
}

export function useIntersectionObserver() {
  const observeList: ObserveEntry[] = []

  function observe(
    target: MaybeRefOrGetter<Element | null>,
    callback: Callback
  ) {
    const element = toValue(target)
    if (element) {
      addobserve(element, callback)
    }

    observeList.push({ target, callback })

    return () => {
      const element = toValue(target)
      element && unobserve(element)
    }
  }

  function clear() {
    for (const item of observeList) {
      const element = toValue(item.target)
      element && unobserve(element)
    }
  }

  onMounted(() => {
    for (const item of observeList) {
      const element = toValue(item.target)
      element && addobserve(element, item.callback)
    }
  })

  onBeforeUnmount(clear)

  return { observe, clear }
}
