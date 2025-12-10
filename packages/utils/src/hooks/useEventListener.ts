import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, onMounted, toValue } from 'vue'

type AddEventListener = {
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

export function useEventListener() {
  const controller = new AbortController()
  const eventQueue: EventEntry[] = []

  const addEventListener: AddEventListener = (
    el: any,
    type: string,
    listener: any,
    options: AddEventListenerOptions = {}
  ) => {
    const element = toValue(el)
    if (element) {
      element.addEventListener(type, listener, {
        signal: controller.signal,
        ...options
      })
    } else {
      eventQueue.push({ el, type, listener, options })
    }
  }

  const clearEventListener = () => controller.abort()

  onMounted(() => {
    for (const { el, type, listener, options } of eventQueue) {
      const element = toValue(el)
      if (!element) continue

      element.addEventListener(type, listener, {
        signal: controller.signal,
        ...options
      })
    }
    eventQueue.length = 0
  })

  onBeforeUnmount(clearEventListener)

  return { addEventListener, clearEventListener }
}
