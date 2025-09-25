import type { MaybeRefOrGetter } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, shallowRef, toValue } from 'vue'

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
    el: MaybeRefOrGetter<EventTarget | null>,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ): void
}

interface EventEntry {
  el: Element
  type: string
  listener: (...args: any[]) => void
  options: AddEventListenerOptions
}

export function useEventListener() {
  const controller = new AbortController()
  const eventQueue = shallowRef<EventEntry[]>([])

  const addEventListener: AddEventListener = (
    el: any,
    type: string,
    listener: any,
    options: AddEventListenerOptions = {}
  ) => {
    const element = toValue(el)
    const _options = {
      signal: controller.signal,
      ...options
    }
    if (element) {
      element.addEventListener(type, listener, _options)
    } else {
      eventQueue.value.push({ el, type, listener, options })
    }
  }

  const clearEventListener = () => {
    controller.abort()
  }

  onMounted(async () => {
    await nextTick()
    for (const { el, type, listener, options } of eventQueue.value) {
      const element = toValue(el)
      if (!element) continue
      element.addEventListener(type, listener, {
        signal: controller.signal,
        ...options
      })
    }
    eventQueue.value.length = 0
  })

  onBeforeUnmount(clearEventListener)

  return { addEventListener, clearEventListener }
}
