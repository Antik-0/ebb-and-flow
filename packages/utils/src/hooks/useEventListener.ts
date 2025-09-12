import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, toValue } from 'vue'

type AddEventListener = {
  <E extends keyof WindowEventMap>(
    el: MaybeRefOrGetter<Window>,
    type: E,
    listener: (this: Window, event: WindowEventMap[E]) => any,
    options?: AddEventListenerOptions
  ): any

  <E extends keyof DocumentEventMap>(
    el: MaybeRefOrGetter<Document>,
    type: E,
    listener: (this: Document, event: DocumentEventMap[E]) => any,
    options?: AddEventListenerOptions
  ): any

  <E extends keyof HTMLElementEventMap>(
    el: MaybeRefOrGetter<HTMLElement>,
    type: E,
    listener: (this: HTMLElement, event: HTMLElementEventMap[E]) => any,
    options?: AddEventListenerOptions
  ): any

  (
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ): any
}

export function useEventListener() {
  const controller = new AbortController()

  const addEventListener: AddEventListener = (
    el: any,
    type: string,
    listener: any,
    options: AddEventListenerOptions = {}
  ) => {
    const targetEl = toValue(el)
    if (!targetEl) return

    targetEl.addEventListener(type, listener, {
      signal: controller.signal,
      ...options
    })
  }

  const clearEventListener = () => controller.abort()

  onBeforeUnmount(clearEventListener)

  return { addEventListener, clearEventListener }
}
