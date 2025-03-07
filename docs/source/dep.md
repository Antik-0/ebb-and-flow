# dep

## 源码

```ts
import { extend, isArray, isIntegerKey, isMap, isSymbol } from '@vue/shared'
import type { ComputedRefImpl } from './computed'
import { type TrackOpTypes, TriggerOpTypes } from './constants'
import {
  type DebuggerEventExtraInfo,
  EffectFlags,
  type Subscriber,
  activeSub,
  endBatch,
  shouldTrack,
  startBatch
} from './effect'

/**
 * Incremented every time a reactive change happens
 * This is used to give computed a fast path to avoid re-compute when nothing
 * has changed.
 */
export let globalVersion = 0

/**
 * ✨Link 连接着一个dep和一个sub
 * Represents a link between a source (Dep) and a subscriber (Effect or Computed).
 * Deps and subs have a many-to-many relationship - each link between a
 * dep and a sub is represented by a Link instance.
 *
 * A Link is also a node in two doubly-linked lists - one for the associated
 * sub to track all its deps, and one for the associated dep to track all its
 * subs.
 *
 * @internal
 */
export class Link {
  /**
   * - Before each effect run, all previous dep links' version are reset to -1
   * - During the run, a link's version is synced with the source dep on access
   * - After the run, links with version -1 (that were never used) are cleaned
   *   up
   */
  version: number

  /**
   * Pointers for doubly-linked lists
   */
  nextDep?: Link
  prevDep?: Link
  nextSub?: Link
  prevSub?: Link
  prevActiveLink?: Link

  constructor(public sub: Subscriber, public dep: Dep) {
    this.version = dep.version
    this.nextDep =
      this.prevDep =
      this.nextSub =
      this.prevSub =
      this.prevActiveLink =
        undefined
  }
}

/**
 * ✨Dep表示一个依赖，以前是通过一个数组来存储其订阅者，现在通过链表跟踪
 * @internal
 */
export class Dep {
  version = 0
  /**
   * Link between this dep and the current active effect
   */
  activeLink?: Link = undefined

  /**
   * ✨该依赖的最后一个订阅者，也可以说是最近的订阅者，是触发 effect 更新用的
   * ✨此 Link 节点的所有 prevSub 节点绑定的 dep 都是当前 dep 实例
   * ✨顺着这个节点往前走，可以从内到外依次访问到当前 dep 的所有订阅者
   * Doubly linked list representing the subscribing effects (tail)
   */
  subs?: Link = undefined

  /**
   * ✨该依赖的首个订阅者，只在开发环境下存在，供调试使用
   * ✨此 Link 节点的所有 nextSub 节点绑定的 dep 都是当前 dep 实例
   * ✨顺着这个节点往后走，可以从外到内依次访问到当前 dep 的所有订阅者
   * Doubly linked list representing the subscribing effects (head)
   * DEV only, for invoking onTrigger hooks in correct order
   */
  subsHead?: Link

  // ✨Link 是一个双向链表节点，subs 和 subsHead 分别对应为头部和尾部节点，为链表遍历提供方便

  /**
   * For object property deps cleanup
   */
  map?: KeyToDepMap = undefined
  key?: unknown = undefined

  /**
   * ✨订阅者总数
   * Subscriber counter
   */
  sc: number = 0

  constructor(public computed?: ComputedRefImpl | undefined) {
    if (__DEV__) {
      this.subsHead = undefined
    }
  }

  track(debugInfo?: DebuggerEventExtraInfo): Link | undefined {
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      // ✨computed 实现了订阅者的接口，在计算属性中访问自身，不需要追踪自身
      return
    }

    // ✨若一个 dep 在一个 effect 中被多次访问，那么从第二次开始 this.activeLink 就不为 undefined
    let link = this.activeLink
    if (link === undefined || link.sub !== activeSub) {
      // ✨首次访问，或者切换 effect，就重新创建一个 Link
      link = this.activeLink = new Link(activeSub, this)

      // add the link to the activeEffect as a dep (as tail)
      if (!activeSub.deps) {
        // ✨activeSub.deps 代表双向链表的头节点，若头节点不存在，则说明这个 sub 是第一次运行
        activeSub.deps = activeSub.depsTail = link
      } else {
        // ✨更新当前 sub 中的 dep 顺序
        link.prevDep = activeSub.depsTail
        activeSub.depsTail!.nextDep = link
        activeSub.depsTail = link
      }

      // ✨更新当前 dep 和 activeEffect 的相关状态
      addSub(link)
    } else if (link.version === -1) {
      // ✨在 track 之前会将当前 effect 中所有的 link 冻结，即设置 version = -1
      // ✨若进入这里的逻辑，说明这个 link 可以复用
      // reused from last run - already a sub, just sync version
      link.version = this.version

      // If this dep has a next, it means it's not at the tail - move it to the
      // tail. This ensures the effect's dep list is in the order they are
      // accessed during evaluation.
      if (link.nextDep) {
        const next = link.nextDep
        next.prevDep = link.prevDep
        if (link.prevDep) {
          link.prevDep.nextDep = next
        }

        link.prevDep = activeSub.depsTail
        link.nextDep = undefined
        activeSub.depsTail!.nextDep = link
        activeSub.depsTail = link

        // this was the head - point to the new head
        if (activeSub.deps === link) {
          activeSub.deps = next
        }
      }
    }

    if (__DEV__ && activeSub.onTrack) {
      activeSub.onTrack(
        extend(
          {
            effect: activeSub
          },
          debugInfo
        )
      )
    }

    return link
  }

  trigger(debugInfo?: DebuggerEventExtraInfo): void {
    // ✨更新 version，dep.version <= globalVersion
    this.version++
    globalVersion++
    // ✨notify 触发响应式更新
    this.notify(debugInfo)
  }

  notify(debugInfo?: DebuggerEventExtraInfo): void {
    startBatch()
    try {
      if (__DEV__) {
        // subs are notified and batched in reverse-order and then invoked in
        // original order at the end of the batch, but onTrigger hooks should
        // be invoked in original order here.
        for (let head = this.subsHead; head; head = head.nextSub) {
          // ✨由外到内，依次触发对应的 sub 的 onTrigger 调试钩子
          if (head.sub.onTrigger && !(head.sub.flags & EffectFlags.NOTIFIED)) {
            head.sub.onTrigger(
              extend(
                {
                  effect: head.sub
                },
                debugInfo
              )
            )
          }
        }
      }
      for (let link = this.subs; link; link = link.prevSub) {
        // ✨从内到外，依次触发对应 sub 的更新
        // ✨为什么是从内到外？因为 effectScope 是存在嵌套的，就像函数作用域一样，内部嵌套的作用域优先级是大于外部的
        // ✨并且组件的状态更新也是由内到外的
        if (link.sub.notify()) {
          // ✨如果一个 sub.notify() 返回 true，代表当前 sub 是一个计算属性
          // ✨一个计算属性更新，需要通知该计算属性的其他 sub 同步更新
          // if notify() returns `true`, this is a computed. Also call notify
          // on its dep - it's called here instead of inside computed's notify
          // in order to reduce call stack depth.
          ;(link.sub as ComputedRefImpl).dep.notify()
        }
      }
    } finally {
      endBatch()
    }
  }
}

/**
 * ✨Link 节点记录了一对 dep 和 sub，因此传入一个 Link，即可同时获取对应的信息
 */
function addSub(link: Link) {
  // ✨dep 对应的订阅者数量 + 1
  link.dep.sc++
  if (link.sub.flags & EffectFlags.TRACKING) {
    // ✨判断当前 dep 是否是一个计算属性
    const computed = link.dep.computed
    // computed getting its first subscriber
    // enable tracking + lazily subscribe to all its deps
    if (computed && !link.dep.subs) {
      // ✨此条件表示当前计算属性没有任何订阅者
      computed.flags |= EffectFlags.TRACKING | EffectFlags.DIRTY
      for (let l = computed.deps; l; l = l.nextDep) {
        // ✨将当前计算属性的所有依赖，绑定到当前的 activeSub 中
        // ✨这里要明白一个东西，计算属性是一个 sub，但是其不会成为一个 activeSub
        // ✨举个例子：
        // ✨const count = ref(1)
        // ✨const double = computed(() => count.value * 2)
        // ✨count.value += 1
        // ✨
        // ✨上面 count 的变动并不会触发 double 这个计算属性的更新，因为代码没有在一个 effectScope 中访问 double.value
        // ✨也就是说没有任何地方需要 double 这个依赖，既然这个依赖无人使用，那么即使 double 的依赖更新了，也并不需要更新 double 这个 effect
        // ✨因而，如果需要用到一个计算属性，那么只需要将这个计算属性的内部依赖，全部绑定到需要用到这个计算属性的 effect 中即可
        // ✨这样，如果计算属性中的某个依赖变动，只需通知一次真正的 effect 更新就行了，而不是先通知计算属性更新，再通知依赖计算属性的 effect 通信
        // ✨而 effect 的更新也顺便重新运行了一次计算属性，从而减少了通信次数，达到优化
        addSub(l)
      }
    }

    // ✨更新相应的 sub 顺序
    const currentTail = link.dep.subs
    if (currentTail !== link) {
      link.prevSub = currentTail
      if (currentTail) currentTail.nextSub = link
    }

    if (__DEV__ && link.dep.subsHead === undefined) {
      link.dep.subsHead = link
    }

    link.dep.subs = link
  }
}

// The main WeakMap that stores {target -> key -> dep} connections.
// Conceptually, it's easier to think of a dependency as a Dep class
// which maintains a Set of subscribers, but we simply store them as
// raw Maps to reduce memory overhead.
type KeyToDepMap = Map<any, Dep>

export const targetMap: WeakMap<object, KeyToDepMap> = new WeakMap()

export const ITERATE_KEY: unique symbol = Symbol(
  __DEV__ ? 'Object iterate' : ''
)
export const MAP_KEY_ITERATE_KEY: unique symbol = Symbol(
  __DEV__ ? 'Map keys iterate' : ''
)
export const ARRAY_ITERATE_KEY: unique symbol = Symbol(
  __DEV__ ? 'Array iterate' : ''
)

/**
 * Tracks access to a reactive property.
 *
 * This will check which effect is running at the moment and record it as dep
 * which records all effects that depend on the reactive property.
 *
 * @param target - Object holding the reactive property.
 * @param type - Defines the type of access to the reactive property.
 * @param key - Identifier of the reactive property to track.
 */
export function track(target: object, type: TrackOpTypes, key: unknown): void {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Dep()))
      dep.map = depsMap
      dep.key = key
    }
    if (__DEV__) {
      dep.track({
        target,
        type,
        key
      })
    } else {
      dep.track()
    }
  }
}

/**
 * Finds all deps associated with the target (or a specific property) and
 * triggers the effects stored within.
 *
 * @param target - The reactive object.
 * @param type - Defines the type of the operation that needs to trigger effects.
 * @param key - Can be used to target a specific reactive property in the target object.
 */
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
): void {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked
    globalVersion++
    return
  }

  const run = (dep: Dep | undefined) => {
    if (dep) {
      if (__DEV__) {
        dep.trigger({
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget
        })
      } else {
        dep.trigger()
      }
    }
  }

  startBatch()

  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    // ✨clearn 类型只作用于集合类型
    depsMap.forEach(run)
  } else {
    const targetIsArray = isArray(target)
    const isArrayIndex = targetIsArray && isIntegerKey(key)

    if (targetIsArray && key === 'length') {
      const newLength = Number(newValue)
      depsMap.forEach((dep, key) => {
        if (
          key === 'length' ||
          key === ARRAY_ITERATE_KEY ||
          (!isSymbol(key) && key >= newLength)
        ) {
          run(dep)
        }
      })
    } else {
      // schedule runs for SET | ADD | DELETE
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key))
      }

      // schedule ARRAY_ITERATE for any numeric key change (length is handled above)
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY))
      }

      // also run for iteration key on ADD | DELETE | Map.SET
      switch (type) {
        case TriggerOpTypes.ADD:
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY))
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY))
            }
          } else if (isArrayIndex) {
            // new index added to array -> length changes
            run(depsMap.get('length'))
          }
          break
        case TriggerOpTypes.DELETE:
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY))
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY))
            }
          }
          break
        case TriggerOpTypes.SET:
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY))
          }
          break
      }
    }
  }

  endBatch()
}

export function getDepFromReactive(
  object: any,
  key: string | number | symbol
): Dep | undefined {
  const depMap = targetMap.get(object)
  return depMap && depMap.get(key)
}
```
