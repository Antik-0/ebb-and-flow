# watch

## 源码

```ts
import {
  EMPTY_OBJ,
  NOOP,
  hasChanged,
  isArray,
  isFunction,
  isMap,
  isObject,
  isPlainObject,
  isSet,
  remove
} from '@vue/shared'
import { warn } from './warning'
import type { ComputedRef } from './computed'
import { ReactiveFlags } from './constants'
import {
  type DebuggerOptions,
  EffectFlags,
  type EffectScheduler,
  ReactiveEffect,
  pauseTracking,
  resetTracking
} from './effect'
import { isReactive, isShallow } from './reactive'
import { type Ref, isRef } from './ref'
import { getCurrentScope } from './effectScope'

// These errors were transferred from `packages/runtime-core/src/errorHandling.ts`
// to @vue/reactivity to allow co-location with the moved base watch logic, hence
// it is essential to keep these values unchanged.
export enum WatchErrorCodes {
  WATCH_GETTER = 2,
  WATCH_CALLBACK,
  WATCH_CLEANUP
}

// ✨watchEffect 的参数接口
export type WatchEffect = (onCleanup: OnCleanup) => void

// ✨watch 的监听源类型
export type WatchSource<T = any> = Ref<T, any> | ComputedRef<T> | (() => T)

export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onCleanup: OnCleanup
) => any

export type OnCleanup = (cleanupFn: () => void) => void

export interface WatchOptions<Immediate = boolean> extends DebuggerOptions {
  immediate?: Immediate
  deep?: boolean | number
  once?: boolean
  scheduler?: WatchScheduler
  onWarn?: (msg: string, ...args: any[]) => void
  /**
   * @internal
   */
  augmentJob?: (job: (...args: any[]) => void) => void
  /**
   * @internal
   */
  call?: (
    fn: Function | Function[],
    type: WatchErrorCodes,
    args?: unknown[]
  ) => void
}

export type WatchStopHandle = () => void

export interface WatchHandle extends WatchStopHandle {
  pause: () => void
  resume: () => void
  stop: () => void
}

// initial value for watchers to trigger on undefined initial values
const INITIAL_WATCHER_VALUE = {}

export type WatchScheduler = (job: () => void, isFirstRun: boolean) => void

// ✨watch 的 cleanup 并没有真正绑定到 effect 上，而是通过 Map 存储
// ✨watch 的 cleanup 回调可以注册多个，而 effect.cleanup 只能绑定一个
const cleanupMap: WeakMap<ReactiveEffect, (() => void)[]> = new WeakMap()
let activeWatcher: ReactiveEffect | undefined = undefined

/**
 * Returns the current active effect if there is one.
 */
export function getCurrentWatcher(): ReactiveEffect<any> | undefined {
  return activeWatcher
}

/**
 * ✨为当前活跃的 effect(watch)，注册一个 cleanup 回调，在重新运行 effect.run 之前调用
 * Registers a cleanup callback on the current active effect. This
 * registered cleanup callback will be invoked right before the
 * associated effect re-runs.
 *
 * @param cleanupFn - The callback function to attach to the effect's cleanup.
 * @param failSilently - if `true`, will not throw warning when called without
 * an active effect.
 * @param owner - The effect that this cleanup function should be attached to.
 * By default, the current active effect.
 */
export function onWatcherCleanup(
  cleanupFn: () => void,
  failSilently = false,
  owner: ReactiveEffect | undefined = activeWatcher
): void {
  if (owner) {
    let cleanups = cleanupMap.get(owner)
    if (!cleanups) cleanupMap.set(owner, (cleanups = []))
    cleanups.push(cleanupFn)
  } else if (__DEV__ && !failSilently) {
    warn(
      `onWatcherCleanup() was called when there was no active watcher` +
        ` to associate with.`
    )
  }
}

/**
 * @param source
 * ✨watch 模式下可以是一个 ref,computed,getter,reactive 或是这些组合的数组
 * ✨watchEffect 模式下，是一个 WatchEffect 类型，绑定于 effect.fn
 */
export function watch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb?: WatchCallback | null,
  options: WatchOptions = EMPTY_OBJ
): WatchHandle {
  const { immediate, deep, once, scheduler, augmentJob, call } = options

  const warnInvalidSource = (s: unknown) => {
    ;(options.onWarn || warn)(
      `Invalid watch source: `,
      s,
      `A watch source can only be a getter/effect function, a ref, ` +
        `a reactive object, or an array of these types.`
    )
  }

  // ✨遍历对象，触发 track，收集依赖
  const reactiveGetter = (source: object) => {
    // traverse will happen in wrapped getter below
    if (deep) return source
    // for `deep: false | 0` or shallow reactive, only traverse root-level properties
    if (isShallow(source) || deep === false || deep === 0)
      return traverse(source, 1)
    // for `deep: undefined` on a reactive object, deeply traverse all properties
    return traverse(source)
  }

  // ✨watch 绑定的 effect 实例
  let effect: ReactiveEffect

  // ✨所有类型的 source 都将转为 getter，作为 effect 的依赖来源，也就是 effect 内部的 fn 函数
  // ✨响应性的追踪，必须要通过 [对象.属性] 的形式才能触发 track，因此需要将具体值包装为一个函数来主动触发
  let getter: () => any

  // ✨重新收集依赖前调用的回调函数，需要运行一次回调才能注册
  let cleanup: (() => void) | undefined

  // ✨作为回调函数参数提供，提供注册 cleanup 回调的方法
  // ✨兼容方法，3.5+ 推荐使用 onWatcherCleanup 钩子
  let boundCleanup: typeof onWatcherCleanup

  let forceTrigger = false
  let isMultiSource = false

  if (isRef(source)) {
    // ✨监听源是一个 Ref，转换为一个 getter
    getter = () => source.value
    forceTrigger = isShallow(source)
  } else if (isReactive(source)) {
    // ✨监听源是一个 Reactive，转换为一个 getter
    getter = () => reactiveGetter(source)
    forceTrigger = true
  } else if (isArray(source)) {
    // ✨监听源是一个数组
    isMultiSource = true
    forceTrigger = source.some(s => isReactive(s) || isShallow(s))

    // ✨转换每个监听源，整体以一个 getter 返回
    getter = () =>
      source.map(s => {
        if (isRef(s)) {
          return s.value
        } else if (isReactive(s)) {
          return reactiveGetter(s)
        } else if (isFunction(s)) {
          return call ? call(s, WatchErrorCodes.WATCH_GETTER) : s()
        } else {
          __DEV__ && warnInvalidSource(s)
        }
      })
  } else if (isFunction(source)) {
    if (cb) {
      // ✨watch 模式，source 已经是一个 getter
      // getter with cb
      getter = call
        ? () => call(source, WatchErrorCodes.WATCH_GETTER)
        : (source as () => any)
    } else {
      // ✨watchEffect 模式，source 是一个 effect
      // no cb -> simple effect
      getter = () => {
        // ✨watchEffect 首次调用不会触发 cleanup
        if (cleanup) {
          pauseTracking()
          try {
            cleanup()
          } finally {
            resetTracking()
          }
        }

        // ✨保存当前上下文
        const currentEffect = activeWatcher
        activeWatcher = effect
        try {
          return call
            ? call(source, WatchErrorCodes.WATCH_CALLBACK, [boundCleanup])
            : source(boundCleanup)
        } finally {
          activeWatcher = currentEffect
        }
      }
    }
  } else {
    // ✨无效的监听源
    getter = NOOP
    __DEV__ && warnInvalidSource(source)
  }

  if (cb && deep) {
    // ✨watch 模式，计算 depth
    const baseGetter = getter
    const depth = deep === true ? Infinity : deep
    getter = () => traverse(baseGetter(), depth)
  }

  // ✨获取当前的 effect 上下文
  const scope = getCurrentScope()

  // ✨watch 控制器，也是 watch 的返回值，用于停用当前 watch
  const watchHandle: WatchHandle = () => {
    effect.stop()

    // 从上下文中移除当前 watch 的 effect
    if (scope && scope.active) {
      remove(scope.effects, effect)
    }
  }

  // ✨watch 只运行一次的情况，对 cb 进行包装，注入 watch 停用函数
  if (once && cb) {
    const _cb = cb
    cb = (...args) => {
      _cb(...args)
      watchHandle()
    }
  }

  // ✨旧值初始化
  let oldValue: any = isMultiSource
    ? new Array((source as []).length).fill(INITIAL_WATCHER_VALUE)
    : INITIAL_WATCHER_VALUE

  // ✨构建调度任务
  const job = (immediateFirstRun?: boolean) => {
    if (
      !(effect.flags & EffectFlags.ACTIVE) ||
      (!effect.dirty && !immediateFirstRun)
    ) {
      // ✨effect 不可用，依赖无变化，不需要立即运行
      return
    }
    if (cb) {
      // ✨watch 模式
      // watch(source, cb)

      // ✨运行 getter，计算新值
      const newValue = effect.run()
      if (
        deep ||
        forceTrigger ||
        (isMultiSource
          ? (newValue as any[]).some((v, i) => hasChanged(v, oldValue[i]))
          : hasChanged(newValue, oldValue))
      ) {
        // ✨深度监听 || 强制触发 || 值发生变化

        // ✨在重新调用 cb 之前运行一次 cleanup
        // cleanup before running cb again
        if (cleanup) {
          cleanup()
        }

        // ✨切换上下文
        const currentWatcher = activeWatcher
        activeWatcher = effect

        try {
          // ✨构造 cb 参数，一共有3个
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE
              ? undefined
              : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE
              ? []
              : oldValue,
            boundCleanup
          ]

          // ✨调用 cb 回调，更新 oldValue
          call
            ? call(cb!, WatchErrorCodes.WATCH_CALLBACK, args)
            : // @ts-expect-error
              cb!(...args)
          oldValue = newValue
        } finally {
          // ✨恢复上下文
          activeWatcher = currentWatcher
        }
      }
    } else {
      // ✨watchEffect 模式，watchEffect 与 watch 最大的不同：
      // ✨watch 的依赖是固定的，而 watchEffect 的依赖是会变动的，需要重新收集
      // watchEffect
      effect.run()
    }
  }

  // ✨任务管理，应该类似批处理
  if (augmentJob) {
    augmentJob(job)
  }

  // ✨创建 effect 实例
  effect = new ReactiveEffect(getter)

  // ✨绑定调度器
  effect.scheduler = scheduler
    ? () => scheduler(job, false)
    : (job as EffectScheduler)

  // ✨注册 cleanup 回调的辅助工具
  boundCleanup = fn => onWatcherCleanup(fn, false, effect)

  // ✨绑定 effect 停用回调
  cleanup = effect.onStop = () => {
    const cleanups = cleanupMap.get(effect)
    if (cleanups) {
      if (call) {
        call(cleanups, WatchErrorCodes.WATCH_CLEANUP)
      } else {
        for (const cleanup of cleanups) cleanup()
      }
      cleanupMap.delete(effect)
    }
  }

  if (__DEV__) {
    effect.onTrack = options.onTrack
    effect.onTrigger = options.onTrigger
  }

  // initial run
  if (cb) {
    if (immediate) {
      // ✨立即执行一次调度
      job(true)
    } else {
      // ✨收集依赖
      oldValue = effect.run()
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true)
  } else {
    // ✨watchEffect，等于立即调用一次回调
    effect.run()
  }

  // ✨绑定暂停、恢复、停用方法
  watchHandle.pause = effect.pause.bind(effect)
  watchHandle.resume = effect.resume.bind(effect)
  watchHandle.stop = watchHandle

  return watchHandle
}

/**
 * ✨递归遍历对象所有属性，触发 track，根据需要收集依赖
 */
export function traverse(
  value: unknown,
  depth: number = Infinity,
  seen?: Set<unknown>
): unknown {
  if (depth <= 0 || !isObject(value) || (value as any)[ReactiveFlags.SKIP]) {
    // ✨第三个条件是 value 被 makeRaw 处理过
    return value
  }

  // ✨seen 为记忆化存储，表示某个相同值已经访问过，减少递归次数
  seen = seen || new Set()
  if (seen.has(value)) {
    return value
  }
  seen.add(value)
  depth--

  if (isRef(value)) {
    // ✨遍历 Ref.value
    traverse(value.value, depth, seen)
  } else if (isArray(value)) {
    // ✨遍历数组成员
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen)
    }
  } else if (isSet(value) || isMap(value)) {
    // ✨遍历集合成员
    value.forEach((v: any) => {
      traverse(v, depth, seen)
    })
  } else if (isPlainObject(value)) {
    // ✨遍历朴素对象
    for (const key in value) {
      traverse(value[key], depth, seen)
    }
    // ✨遍历对象可枚举的 Symbols，通常是用户自定义的
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key as any], depth, seen)
      }
    }
  }
  return value
}
```
