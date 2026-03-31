import { isFunction, isPlainObject } from '@repo/utils'
import { useSyncExternalStore } from 'react'

type StateRecord = Record<string, any>

type Subscriber = () => void

type MaybeStateOrSetter<S = any> = Partial<S> | ((state: S) => Partial<S>)

type GetState<S = any> = () => S

type SetState<S = any> = (value: MaybeStateOrSetter<S>) => void

interface EbbStore<S = any> {
  state: S
  getState: GetState<S>
  setState: SetState<S>
  reset: () => void
}

/**
 * ✨ 定义全局共享状态器
 *
 * 📢 暂时不支持嵌套对象
 */
export function defineEbbStore<S extends StateRecord = any>(
  setup: (set: SetState<S>, get: GetState<S>) => S
) {
  // 创建一个纯净对象
  const store = Object.create(null) as EbbStore<S>

  const subscribers = new Set<Subscriber>()

  const subscribe = (subscriber: Subscriber) => {
    subscribers.add(subscriber)
    return () => subscribers.delete(subscriber)
  }

  /**
   * 通知信号量，用于控制批处理 `notify()`
   */
  let notifySignal = false

  const notify = () => {
    if (notifySignal) return
    notifySignal = true

    window.queueMicrotask(() => {
      subscribers.forEach(subscriber => {
        subscriber()
      })
      notifySignal = false
    })
  }

  const setState: SetState<S> = value => {
    const oldState = store.state
    // 传入浅复制，不允许 `update` 内部原地修改 `state`
    const newState = isFunction(value) ? value({ ...oldState }) : value

    // 做一层浅引用对比
    let hasChange = false
    for (const key in newState) {
      const oldVal = oldState[key]
      const newVal = newState[key]
      if (!Object.is(oldVal, newVal)) {
        hasChange = true
        break
      }
    }

    if (hasChange) {
      store.state = { ...oldState, ...newState }
      notify()
    }
  }

  const getState: GetState<S> = () => store.state

  const initState = setup(setState, getState)

  if (!isPlainObject(initState)) {
    const stateType = Object.prototype.toString.call(initState)
    throw new Error(
      '[defineEbbStore Error]: ' +
        'setup should return a plainObject, ' +
        `but received ${stateType}`
    )
  }

  store.state = initState
  const reset = () => setState(initState)

  Object.assign(store, { getState, setState, reset })

  const useStore = <T>(getter: (state: S) => T) => {
    const getSnapshop = () => getter(store.state)
    return useSyncExternalStore(subscribe, getSnapshop, getSnapshop)
  }

  return [useStore, store] as const
}
