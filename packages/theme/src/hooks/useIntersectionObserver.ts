import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, toValue } from 'vue'

type Callback = (entry: IntersectionObserverEntry) => void

let observer: IntersectionObserver | null = null
let subscriber = 0
const observeMap = new WeakMap<Element, Set<Callback>>()

function createIntersectionObserver() {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const cbs = observeMap.get(entry.target) ?? []
      for (const cb of cbs) {
        cb(entry)
      }
    }
  })
  return observer
}

function observe(target: Element, callback: Callback) {
  if (!observer) {
    observer = createIntersectionObserver()
  }
  if (!observeMap.has(target)) {
    observeMap.set(target, new Set())
    observer.observe(target)
    subscriber += 1
  }
  const cbs = observeMap.get(target)!
  cbs.add(callback)
}

function unobserve(target: Element, callback: Callback) {
  if (!observer || !observeMap.has(target)) {
    return
  }

  const cbs = observeMap.get(target)!
  cbs.delete(callback)

  if (cbs.size === 0) {
    observer.unobserve(target)
    observeMap.delete(target)
    subscriber -= 1
  }

  if (subscriber === 0) {
    observer.disconnect()
    observer = null
  }
}

interface ObserveEntry {
  target: Element
  callback: Callback
}

export function useIntersectionObserver() {
  const observeEntries: ObserveEntry[] = []

  const _observe = (
    target: MaybeRefOrGetter<Element | null>,
    callback: Callback
  ) => {
    const element = toValue(target)
    if (!element) return
    observe(element, callback)
    observeEntries.push({ target: element, callback })
  }

  const clear = () => {
    for (const { target, callback } of observeEntries) {
      target && unobserve(target, callback)
    }
    observeEntries.length = 0
  }

  onBeforeUnmount(clear)

  return { observe: _observe, clear }
}
