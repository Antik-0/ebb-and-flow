import type { MaybeRefOrGetter } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, toValue } from 'vue'

type Callback = (entry: ResizeObserverEntry) => void

let observer: ResizeObserver | null = null
let subscriber = 0
const observeMap = new WeakMap<Element, Set<Callback>>()

function createResizeObserver() {
  const observer = new ResizeObserver(entries => {
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
    observer = createResizeObserver()
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
  target: MaybeRefOrGetter<Element | null>
  callback: Callback
}

export function useResizeObserver() {
  const observeEntries: ObserveEntry[] = []
  const windowResizeCbs: Callback[] = []

  const _observe = (
    target: MaybeRefOrGetter<Element | null>,
    callback: Callback
  ) => {
    const element = toValue(target)
    if (element) {
      observe(element, callback)
    }
    observeEntries.push({ target, callback })
  }

  const clear = () => {
    for (const { target, callback } of observeEntries) {
      const element = toValue(target)
      element && unobserve(element, callback)
    }
    observeEntries.length = 0
    windowResizeCbs.length = 0
  }

  onMounted(async () => {
    await nextTick()
    for (const { target, callback } of observeEntries) {
      const element = toValue(target)
      element && observe(element, callback)
    }

    const root = document.documentElement
    for (const cb of windowResizeCbs) {
      _observe(root, cb)
    }
  })

  onBeforeUnmount(clear)

  const onWindowResize = (callback: Callback) => {
    windowResizeCbs.push(callback)
  }

  return {
    onWindowResize,
    observe: _observe,
    clear
  }
}
