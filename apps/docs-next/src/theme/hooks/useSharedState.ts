import { useSyncExternalStore } from 'react'

type Listener = () => void

export function createSharedState<
  T extends (...args: any[]) => any,
  S = ReturnType<T>
>(fn: T) {
  let subscribers = 0
  let state: S | null
  let listeners: Listener[] = []

  function subscribe(listener: Listener) {
    subscribers++
    listeners.push(listener)

    return () => {
      listeners = listeners.filter(l => l !== listener)
      if (--subscribers <= 0) {
        state = null
      }
    }
  }

  function getSnapshot() {
    return state
  }

  function dispatch() {
    for (const listener of listeners) {
      listener()
    }
  }

  // 这里要传入 dispatch 给下面
  return (...args: Parameters<T>) => {
    if (!state) {
      state = fn(...args)
    }

    return useSyncExternalStore(subscribe, getSnapshot)
  }
}
