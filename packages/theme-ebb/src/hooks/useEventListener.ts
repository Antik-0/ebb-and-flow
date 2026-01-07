import type { MaybeRefOrGetter } from './helper'
import { useCallback, useEffect, useRef } from 'react'
import { toValue } from './helper'

interface AddEventListener {
  <E extends keyof WindowEventMap>(
    el: MaybeRefOrGetter<Window>,
    type: E,
    listener: (this: Window, event: WindowEventMap[E]) => void,
    options?: AddEventListenerOptions
  ): void

  <E extends keyof DocumentEventMap>(
    el: MaybeRefOrGetter<Document>,
    type: E,
    listener: (this: Document, event: DocumentEventMap[E]) => void,
    options?: AddEventListenerOptions
  ): void

  <E extends keyof HTMLElementEventMap>(
    el: MaybeRefOrGetter<HTMLElement>,
    type: E,
    listener: (this: HTMLElement, event: HTMLElementEventMap[E]) => void,
    options?: AddEventListenerOptions
  ): void

  (
    el: MaybeRefOrGetter<EventTarget | null>,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ): void
}

interface EventEntry {
  el: MaybeRefOrGetter<Element | null>
  type: string
  listener: (...args: any[]) => void
  options: AddEventListenerOptions
}

type ListenerMap = Record<string, (...args: any[]) => void>

function addEventListenerProxy(
  el: Element,
  type: string,
  listener: (...args: any[]) => void,
  options: AddEventListenerOptions = {},
  cacheMap: WeakMap<Element, ListenerMap>
) {
  if (!cacheMap.has(el)) {
    cacheMap.set(el, {})
  }
  const events = cacheMap.get(el)!
  const isInit = !Reflect.has(events, type)
  events[type] = listener

  if (isInit) {
    el.addEventListener(
      type,
      (...args: any[]) => events[type]?.(...args),
      options
    )
  }
}

export function useEventListener() {
  const controller = useRef(new AbortController())
  // 待绑定监听事件的元素队列
  const eventQueue = useRef<EventEntry[]>([])
  // 保存元素的绑定事件
  const listenerMap = useRef(new WeakMap<Element, ListenerMap>())

  const addEventListener: AddEventListener = useCallback(
    (
      el: any,
      type: string,
      listener: any,
      options: AddEventListenerOptions = {}
    ) => {
      const element = toValue(el)
      if (element) {
        addEventListenerProxy(
          element,
          type,
          listener,
          {
            signal: controller.current.signal,
            ...options
          },
          listenerMap.current
        )
      } else {
        eventQueue.current.push({ el, type, listener, options })
      }
    },
    []
  )

  const clearEventListener = useCallback(() => {
    controller.current.abort()
    eventQueue.current.length = 0
  }, [])

  useEffect(() => {
    for (const { el, type, listener, options } of eventQueue.current) {
      const element = toValue(el)
      if (!element) continue

      addEventListenerProxy(
        element,
        type,
        listener,
        {
          signal: controller.current.signal,
          ...options
        },
        listenerMap.current
      )
    }
    eventQueue.current.length = 0

    return clearEventListener
  }, [])

  return { addEventListener, clearEventListener }
}
