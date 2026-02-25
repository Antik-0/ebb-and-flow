import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, toValue } from 'vue'

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

export function useEventListener() {
  const controller = new AbortController()

  const addEventListener: AddEventListener = (
    el: any,
    type: string,
    listener: any,
    options: AddEventListenerOptions = {}
  ) => {
    const element = toValue(el)
    if (!element) return

    element.addEventListener(type, listener, {
      signal: controller.signal,
      ...options
    })
  }

  const clearEventListener = () => controller.abort()

  onBeforeUnmount(clearEventListener)

  return { addEventListener, clearEventListener }
}
