import { useCallback, useEffect, useRef } from 'react'
import { toValue } from '#/utils'

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

export function useEventListener() {
  const controller = useRef(new AbortController())

  const addEventListener: AddEventListener = useCallback(
    (
      el: any,
      type: string,
      listener: any,
      options: AddEventListenerOptions = {}
    ) => {
      const element = toValue(el)
      if (!element) return

      element.addEventListener(type, listener, {
        signal: controller.current.signal,
        ...options
      })
    },
    []
  )

  const clearEventListener = useCallback(() => {
    controller.current.abort()
  }, [])

  useEffect(() => {
    return clearEventListener
  }, [])

  return { addEventListener, clearEventListener }
}
