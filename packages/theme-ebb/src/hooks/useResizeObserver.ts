import type { MaybeRefOrGetter } from './helper'
import { useCallback, useEffect, useRef } from 'react'
import { toValue } from './helper'

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
  element: Element
  callback: Callback
}

export function useResizeObserver() {
  const observeEntries = useRef<ObserveEntry[]>([])

  const _observe = useCallback(
    (target: MaybeRefOrGetter<Element | null>, callback: Callback) => {
      const element = toValue(target)
      if (!element) return

      observe(element, callback)
      observeEntries.current.push({ element, callback })

      return () => unobserve(element, callback)
    },
    []
  )

  const onWindowResize = useCallback((callback: Callback) => {
    _observe(document.documentElement, callback)
  }, [])

  useEffect(() => {
    return () => {
      for (const { element, callback } of observeEntries.current) {
        unobserve(element, callback)
      }
    }
  }, [])

  return { observe: _observe, onWindowResize }
}
