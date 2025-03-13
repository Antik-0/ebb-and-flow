# vue 源码解析 - effect

## 源码

```ts
import { extend, hasChanged } from '@vue/shared'
import type { ComputedRefImpl } from './computed'
import type { TrackOpTypes, TriggerOpTypes } from './constants'
import { type Link, globalVersion } from './dep'
import { activeEffectScope } from './effectScope'
import { warn } from './warning'

export type EffectScheduler = (...args: any[]) => any

export type DebuggerEvent = {
  effect: Subscriber
} & DebuggerEventExtraInfo

export type DebuggerEventExtraInfo = {
  target: object
  type: TrackOpTypes | TriggerOpTypes
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}

export interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

export interface ReactiveEffectOptions extends DebuggerOptions {
  scheduler?: EffectScheduler
  allowRecurse?: boolean
  onStop?: () => void
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

export let activeSub: Subscriber | undefined

export enum EffectFlags {
  /**
   * ReactiveEffect only
   */
  ACTIVE = 1 << 0, // ✨激活中状态(是否可用)
  RUNNING = 1 << 1, // ✨运行中状态(是否正在运行回调)
  TRACKING = 1 << 2, // ✨追踪依赖中状态(是否可以收集依赖)
  NOTIFIED = 1 << 3, // ✨已通知状态(表示已加入批处理队列，但是可能还未更新)
  DIRTY = 1 << 4, // ✨脏状态(依赖变动，需要更新)
  ALLOW_RECURSE = 1 << 5, // ✨允许递归(允许收集嵌套的依赖)
  PAUSED = 1 << 6 // ✨暂停状态(暂停依赖收集)
}

/**
 * ✨订阅者就是一个 effect，在下文注释中会混合使用订阅者和 effect，本质是一个东西
 * Subscriber is a type that tracks (or subscribes to) a list of deps.
 */
export interface Subscriber extends DebuggerOptions {
  /**
   * Head of the doubly linked list representing the deps
   * @internal
   */
  deps?: Link
  /**
   * Tail of the same list
   * @internal
   */
  depsTail?: Link
  /**
   * @internal
   */
  flags: EffectFlags
  /**
   * @internal
   */
  next?: Subscriber
  /**
   * returning `true` indicates it's a computed that needs to call notify
   * on its dep too
   * @internal
   */
  notify(): true | void
}

const pausedQueueEffects = new WeakSet<ReactiveEffect>()

export class ReactiveEffect<T = any>
  implements Subscriber, ReactiveEffectOptions
{
  /**
   *✨订阅的第一个依赖，链表的头部节点
   * @internal
   */
  deps?: Link = undefined
  /**
   * ✨订阅的最后一个依赖，链表的尾部节点
   * @internal
   */
  depsTail?: Link = undefined
  /**
   * ✨当前 effect 的状态，用二进制位表示，新建为激活中状态和可追踪依赖状态
   * @internal
   */
  flags: EffectFlags = EffectFlags.ACTIVE | EffectFlags.TRACKING
  /**
   * ✨指向下一个需要进行更新的 effect，类比组件嵌套，也就是指向当前上下文的父上下文，具体见下文的 batch 流程
   * @internal
   */
  next?: Subscriber = undefined
  /**
   * ✨effect 依赖清除的回调，在重新收集依赖或停用 effect 的时候调用
   * @internal
   */
  cleanup?: () => void = undefined
  /**
   * ✨决定当前 effect 何时更新的调度器，不在本模块范围内
   */
  scheduler?: EffectScheduler = undefined
  /**
   * ✨effect 停用的回调
   */
  onStop?: () => void
  /**
   * ✨开发环境下的调试钩子
   */
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void

  constructor(public fn: () => T) {
    // ✨fn 函数就是 effect 的更新函数，比如 watch 的回调
    if (activeEffectScope && activeEffectScope.active) {
      // ✨将当前 effect 推入当前活跃的上下文
      activeEffectScope.effects.push(this)
    }
  }

  pause(): void {
    this.flags |= EffectFlags.PAUSED
  }

  resume(): void {
    if (this.flags & EffectFlags.PAUSED) {
      // ✨关闭暂停状态，保持其他状态不变，并执行一次更新
      this.flags &= ~EffectFlags.PAUSED
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this)
        this.trigger()
      }
    }
  }

  /**
   * ✨将当前 effect 加入批处理队列，此时还未执行更新
   * @internal
   */
  notify(): void {
    if (
      this.flags & EffectFlags.RUNNING &&
      !(this.flags & EffectFlags.ALLOW_RECURSE)
    ) {
      return
    }
    if (!(this.flags & EffectFlags.NOTIFIED)) {
      batch(this)
    }
  }

  run(): T {
    // TODO cleanupEffect

    if (!(this.flags & EffectFlags.ACTIVE)) {
      // stopped during cleanup
      return this.fn()
    }

    // ✨打开运行中状态
    this.flags |= EffectFlags.RUNNING

    // ✨运行 cleanup 回调，只运行一次
    cleanupEffect(this)

    // ✨标记当前 effect 所有绑定的 dep 为失活状态，即将当前 effect 下的所有依赖的 version 设置为 -1
    // ✨等 this.fn() 运行完后，清理掉 dep.version = -1 的依赖，代表这个依赖不需要了
    prepareDeps(this)

    // ✨effectScope 存在嵌套调用
    // ✨保存当前上下文
    const prevEffect = activeSub
    const prevShouldTrack = shouldTrack

    // ✨设置新的上下文
    activeSub = this
    shouldTrack = true

    try {
      // ✨执行 effect 的更新函数
      return this.fn()
    } finally {
      if (__DEV__ && activeSub !== this) {
        // ✨内部 bug 提示，effect 上下文不对
        warn(
          'Active effect was not restored correctly - ' +
            'this is likely a Vue internal bug.'
        )
      }

      // ✨重新收集依赖，清除当前 effect 下所有 version = -1 的 dep
      // ✨通过 dep.version 可以判断之前的依赖是否可以复用，避免不必要的创建
      cleanupDeps(this)

      // ✨运行结束，恢复之前的上下文
      activeSub = prevEffect
      shouldTrack = prevShouldTrack

      // ✨关闭运行中状态
      this.flags &= ~EffectFlags.RUNNING
    }
  }

  stop(): void {
    // ✨停用当前 effect
    if (this.flags & EffectFlags.ACTIVE) {
      for (let link = this.deps; link; link = link.nextDep) {
        // ✨从头开始，按顺序，断开所有与该 effect 有关的 dep 链接
        removeSub(link)
      }

      // ✨清空依赖
      this.deps = this.depsTail = undefined

      // ✨运行清空回调
      cleanupEffect(this)
      this.onStop && this.onStop()

      // ✨设置当前 effect 为不可用状态，并保持其他状态不变
      this.flags &= ~EffectFlags.ACTIVE
    }
  }

  trigger(): void {
    if (this.flags & EffectFlags.PAUSED) {
      // ✨处于暂停状态，加入暂停队列
      pausedQueueEffects.add(this)
    } else if (this.scheduler) {
      // ✨存在调度器，执行调度器
      this.scheduler()
    } else {
      // ✨判断依赖是否变动来决定是否需要执行更新回调
      this.runIfDirty()
    }
  }

  /**
   * @internal
   */
  runIfDirty(): void {
    // ✨dirty 状态可以简单理解为该 effect 绑定的依赖是否发生变动
    if (isDirty(this)) {
      this.run()
    }
  }

  get dirty(): boolean {
    return isDirty(this)
  }
}

/**
 * For debugging
 */
// function printDeps(sub: Subscriber) {
//   let d = sub.deps
//   let ds = []
//   while (d) {
//     ds.push(d)
//     d = d.nextDep
//   }
//   return ds.map(d => ({
//     id: d.id,
//     prev: d.prevDep?.id,
//     next: d.nextDep?.id,
//   }))
// }

// ✨批处理的深度，其实就是表示 effect 上下文的嵌套深度
let batchDepth = 0

// ✨分别指向当前上下文的最后一个需要执行更新的 effect
// ✨顺着 effect.next 向上遍历，通知父级 effect 的更新
let batchedSub: Subscriber | undefined
let batchedComputed: Subscriber | undefined

export function batch(sub: Subscriber, isComputed = false): void {
  // ✨标记当前 effect 需要更新，但还未开始执行
  sub.flags |= EffectFlags.NOTIFIED

  // ✨next 就是一条链路，表示下一个要更新的 effect
  // ✨指向的是当前 effectScope 的上级 effectScope，类比嵌套组件的更新流程
  if (isComputed) {
    sub.next = batchedComputed
    batchedComputed = sub
    return
  }
  sub.next = batchedSub
  batchedSub = sub
}

/**
 * @internal
 */
export function startBatch(): void {
  // ✨嵌套 +1，需要与 endBatch 配合使用
  batchDepth++
}

/**
 * Run batched effects when all batches have ended
 * @internal
 */
export function endBatch(): void {
  if (--batchDepth > 0) {
    return
  }

  if (batchedComputed) {
    let e: Subscriber | undefined = batchedComputed
    batchedComputed = undefined
    while (e) {
      const next: Subscriber | undefined = e.next
      e.next = undefined
      e.flags &= ~EffectFlags.NOTIFIED
      e = next
      // ✨计算属性不需要主动触发更新，因为计算属性本身还是一个 dep
    }
  }

  // ✨向上遍历，依次触发对应 effect 更新
  let error: unknown
  while (batchedSub) {
    let e: Subscriber | undefined = batchedSub
    batchedSub = undefined
    while (e) {
      const next: Subscriber | undefined = e.next
      e.next = undefined
      e.flags &= ~EffectFlags.NOTIFIED
      if (e.flags & EffectFlags.ACTIVE) {
        try {
          // ACTIVE flag is effect-only
          ;(e as ReactiveEffect).trigger()
        } catch (err) {
          if (!error) error = err
        }
      }
      e = next
    }
  }

  if (error) throw error
}

/**
 * ✨重新收集依赖(标记阶段)
 */
function prepareDeps(sub: Subscriber) {
  // Prepare deps for tracking, starting from the head
  for (let link = sub.deps; link; link = link.nextDep) {
    // set all previous deps' (if any) version to -1 so that we can track
    // which ones are unused after the run
    link.version = -1
    // store previous active sub if link was being used in another context
    link.prevActiveLink = link.dep.activeLink
    link.dep.activeLink = link
  }
}

/**
 * ✨重新收集依赖(计算阶段)
 */
function cleanupDeps(sub: Subscriber) {
  // Cleanup unsued deps
  let head
  let tail = sub.depsTail
  let link = tail
  while (link) {
    const prev = link.prevDep
    if (link.version === -1) {
      // ✨version = -1 代表这个依赖不需要了

      // ✨如果当前依赖是最后一个，更新尾部节点
      if (link === tail) tail = prev

      // ✨双向解除对应的 dep 和 effect 绑定
      // unused - remove it from the dep's subscribing effect list
      removeSub(link)
      // also remove it from this effect's dep list
      removeDep(link)
    } else {
      // ✨更新头部节点，注意链表是由后往前遍历的
      // The new head is the last node seen which wasn't removed
      // from the doubly-linked list
      head = link
    }

    // restore previous active link if any
    link.dep.activeLink = link.prevActiveLink
    link.prevActiveLink = undefined
    link = prev
  }

  // ✨更新当前订阅者的首尾节点
  // set the new head & tail
  sub.deps = head
  sub.depsTail = tail
}

function isDirty(sub: Subscriber): boolean {
  // ✨根据 dep.version 和 link.version 来判断 dep 是否变动
  // ✨如果 dep 是个计算属性，那么就刷新计算属性的值后再判断 version
  for (let link = sub.deps; link; link = link.nextDep) {
    if (
      link.dep.version !== link.version ||
      (link.dep.computed &&
        (refreshComputed(link.dep.computed) ||
          link.dep.version !== link.version))
    ) {
      return true
    }
  }
  // @ts-expect-error only for backwards compatibility where libs manually set
  // this flag - e.g. Pinia's testing module
  if (sub._dirty) {
    return true
  }
  return false
}

/**
 * ✨只是刷新计算属性的值，不返回任何东西，如果抛错，代表刷新失败
 * Returning false indicates the refresh failed
 * @internal
 */
export function refreshComputed(computed: ComputedRefImpl): undefined {
  if (
    computed.flags & EffectFlags.TRACKING &&
    !(computed.flags & EffectFlags.DIRTY)
  ) {
    // ✨依赖未发生变化
    return
  }

  // ✨暂时关闭 DIRTY 状态
  computed.flags &= ~EffectFlags.DIRTY

  // Global version fast path when no reactive changes has happened since
  // last refresh.
  if (computed.globalVersion === globalVersion) {
    return
  }
  computed.globalVersion = globalVersion

  const dep = computed.dep

  // ✨打开运行状态，表示要重新运行一次计算属性
  computed.flags |= EffectFlags.RUNNING
  // In SSR there will be no render effect, so the computed has no subscriber
  // and therefore tracks no deps, thus we cannot rely on the dirty check.
  // Instead, computed always re-evaluate and relies on the globalVersion
  // fast path above for caching.
  if (
    dep.version > 0 &&
    !computed.isSSR &&
    computed.deps &&
    !isDirty(computed)
  ) {
    computed.flags &= ~EffectFlags.RUNNING
    return
  }

  // ✨保存上下文
  const prevSub = activeSub
  const prevShouldTrack = shouldTrack
  activeSub = computed
  shouldTrack = true

  try {
    // ✨依赖标记阶段
    prepareDeps(computed)

    // ✨重新计算 computed 的值
    const value = computed.fn(computed._value)

    // ✨首次执行，或者值发生了改变
    if (dep.version === 0 || hasChanged(value, computed._value)) {
      computed._value = value
      dep.version++
    }
  } catch (err) {
    // ✨即便刷新出错，依然标记当前 dep 运行过一次
    dep.version++
    throw err
  } finally {
    // ✨恢复上下文，重新收集依赖，结束运行
    activeSub = prevSub
    shouldTrack = prevShouldTrack
    cleanupDeps(computed)
    computed.flags &= ~EffectFlags.RUNNING
  }
}

/**
 * ✨通过链表节点从 dep 中删除 sub
 */
function removeSub(link: Link, soft = false) {
  const { dep, prevSub, nextSub } = link

  // ✨删除当前链表节点
  if (prevSub) {
    prevSub.nextSub = nextSub
    link.prevSub = undefined
  }
  if (nextSub) {
    nextSub.prevSub = prevSub
    link.nextSub = undefined
  }

  // ✨dep.subsHead 指向 dep 的首个订阅者，subsHead 只存在于开发环境
  if (__DEV__ && dep.subsHead === link) {
    // was previous head, point new head to next
    dep.subsHead = nextSub
  }

  // ✨dep.subs 指向 dep 的最后一个订阅者
  if (dep.subs === link) {
    // ✨断开当前 dep 和 effect 的链接
    // was previous tail, point new tail to prev
    dep.subs = prevSub

    // ✨dep.computed 是一个订阅者实例，即一个 effect
    if (!prevSub && dep.computed) {
      // ✨结合 dep.subs === link 和 !prevSub 两个条件
      // ✨说明当前 effect 是这个计算属性 dep 的唯一订阅者

      // if computed, unsubscribe it from all its deps so this computed and its
      // value can be GCed
      // ✨标记当前这个计算属性不可追踪，因为没有订阅者了
      dep.computed.flags &= ~EffectFlags.TRACKING
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        // ✨软删除这个计算属性对其所有依赖的订阅，软删除指的是不删除对 dep 的引用
        // here we are only "soft" unsubscribing because the computed still keeps
        // referencing the deps and the dep should not decrease its sub count
        removeSub(l, true)
      }
    }
  }

  if (!soft && !--dep.sc && dep.map) {
    // ✨当前依赖没有订阅者了，删除对当前 dep 的引用
    // #11979
    // property dep no longer has effect subscribers, delete it
    // this mostly is for the case where an object is kept in memory but only a
    // subset of its properties is tracked at one time
    dep.map.delete(dep.key)
  }
}

/**
 * ✨通过链表节点从 sub 中删除 dep
 */
function removeDep(link: Link) {
  const { prevDep, nextDep } = link
  if (prevDep) {
    prevDep.nextDep = nextDep
    link.prevDep = undefined
  }
  if (nextDep) {
    nextDep.prevDep = prevDep
    link.nextDep = undefined
  }
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

/**
 * ✨创建一个 effect 实例
 */
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner<T> {
  if ((fn as ReactiveEffectRunner).effect instanceof ReactiveEffect) {
    fn = (fn as ReactiveEffectRunner).effect.fn
  }

  const e = new ReactiveEffect(fn)
  if (options) {
    extend(e, options)
  }
  try {
    e.run()
  } catch (err) {
    e.stop()
    throw err
  }
  const runner = e.run.bind(e) as ReactiveEffectRunner
  runner.effect = e
  return runner
}

/**
 * Stops the effect associated with the given runner.
 *
 * @param runner - Association with the effect to stop tracking.
 */
export function stop(runner: ReactiveEffectRunner): void {
  runner.effect.stop()
}

/**
 * @internal
 */
export let shouldTrack = true
const trackStack: boolean[] = []

/**
 * Temporarily pauses tracking.
 */
export function pauseTracking(): void {
  trackStack.push(shouldTrack)
  shouldTrack = false
}

/**
 * Re-enables effect tracking (if it was paused).
 */
export function enableTracking(): void {
  trackStack.push(shouldTrack)
  shouldTrack = true
}

/**
 * Resets the previous global effect tracking state.
 */
export function resetTracking(): void {
  const last = trackStack.pop()
  // ✨undefined 表示 trackStack 为空
  shouldTrack = last === undefined ? true : last
}

/**
 * ✨为 effect 注册清理回调
 * Registers a cleanup function for the current active effect.
 * The cleanup function is called right before the next effect run, or when the
 * effect is stopped.
 *
 * Throws a warning if there is no current active effect. The warning can be
 * suppressed by passing `true` to the second argument.
 *
 * @param fn - the cleanup function to be registered
 * @param failSilently - if `true`, will not throw warning when called without
 * an active effect.
 */
export function onEffectCleanup(fn: () => void, failSilently = false): void {
  if (activeSub instanceof ReactiveEffect) {
    activeSub.cleanup = fn
  } else if (__DEV__ && !failSilently) {
    warn(
      `onEffectCleanup() was called when there was no active effect` +
        ` to associate with.`
    )
  }
}

function cleanupEffect(e: ReactiveEffect) {
  const { cleanup } = e
  e.cleanup = undefined
  if (cleanup) {
    // ✨运行 cleanup 的时候，不要让当前 effect 处于激活状态
    // run cleanup without active effect
    const prevSub = activeSub
    activeSub = undefined
    try {
      cleanup()
    } finally {
      activeSub = prevSub
    }
  }
}
```
