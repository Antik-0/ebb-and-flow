import { useCallback, useEffect, useRef } from 'react'

interface AddEventListener {
  <E extends keyof WindowEventMap>(
    el: Window,
    type: E,
    listener: (this: Window, event: WindowEventMap[E]) => void,
    options?: AddEventListenerOptions
  ): void

  <E extends keyof DocumentEventMap>(
    el: Document,
    type: E,
    listener: (this: Document, event: DocumentEventMap[E]) => void,
    options?: AddEventListenerOptions
  ): void

  <E extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    type: E,
    listener: (this: HTMLElement, event: HTMLElementEventMap[E]) => void,
    options?: AddEventListenerOptions
  ): void

  (
    el: EventTarget | null,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ): void
}

interface EventEntry {
  el: Element
  type: string
  listener: (...args: any[]) => void
}

export function useEventListener() {
  const controller = useRef(new AbortController())
  const eventEntries = useRef<EventEntry[]>([])

  const addEventListener: AddEventListener = useCallback(
    (
      el: any,
      type: string,
      listener: any,
      options: AddEventListenerOptions = {}
    ) => {
      if (!el) return
      ;(el as Element).addEventListener(type, listener, options)
      eventEntries.current.push({ el, type, listener })

      return () => {
        if (!el) return
        ;(el as Element).removeEventListener(type, listener)
      }
    },
    []
  )

  const clearEventListener = useCallback(() => {
    controller.current.abort()
    eventEntries.current.length = 0
  }, [])

  useEffect(() => {
    return clearEventListener
  }, [])

  return { addEventListener, clearEventListener }
}
