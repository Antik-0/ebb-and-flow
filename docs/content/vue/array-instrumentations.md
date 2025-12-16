---
tags: ['Vue 源码解析', '数组代理']
---

# vue 源码解析 - arrayInstrumentations

::page-meta
::

## 源码

```ts
import { TrackOpTypes } from './constants'
import { endBatch, pauseTracking, resetTracking, startBatch } from './effect'
import { isProxy, isShallow, toRaw, toReactive } from './reactive'
import { ARRAY_ITERATE_KEY, track } from './dep'
import { isArray } from '@vue/shared'

/**
 * ✨创建响应性数组，若入参经过reactive/readonly包装，则对每个数组成员进行响应式转换，否则返回原始数据
 * Track array iteration and return:
 * - if input is reactive: a cloned raw array with reactive values
 * - if input is non-reactive or shallowReactive: the original raw array
 */
export function reactiveReadArray<T>(array: T[]): T[] {
  const raw = toRaw(array)
  if (raw === array) return raw
  track(raw, TrackOpTypes.ITERATE, ARRAY_ITERATE_KEY)
  return isShallow(array) ? raw : raw.map(toReactive)
}

/**
 * Track array iteration and return raw array
 */
export function shallowReadArray<T>(arr: T[]): T[] {
  track((arr = toRaw(arr)), TrackOpTypes.ITERATE, ARRAY_ITERATE_KEY)
  return arr
}

export const arrayInstrumentations: Record<string | symbol, Function> = <any>{
  __proto__: null,

  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, toReactive)
  },

  concat(...args: unknown[]) {
    return reactiveReadArray(this).concat(
      ...args.map(x => (isArray(x) ? reactiveReadArray(x) : x))
    )
  },

  entries() {
    return iterator(this, 'entries', (value: [number, unknown]) => {
      value[1] = toReactive(value[1])
      return value
    })
  },

  every(
    fn: (item: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown
  ) {
    return apply(this, 'every', fn, thisArg, undefined, arguments)
  },

  filter(
    fn: (item: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown
  ) {
    return apply(this, 'filter', fn, thisArg, v => v.map(toReactive), arguments)
  },

  find(
    fn: (item: unknown, index: number, array: unknown[]) => boolean,
    thisArg?: unknown
  ) {
    return apply(this, 'find', fn, thisArg, toReactive, arguments)
  },

  findIndex(
    fn: (item: unknown, index: number, array: unknown[]) => boolean,
    thisArg?: unknown
  ) {
    return apply(this, 'findIndex', fn, thisArg, undefined, arguments)
  },

  findLast(
    fn: (item: unknown, index: number, array: unknown[]) => boolean,
    thisArg?: unknown
  ) {
    return apply(this, 'findLast', fn, thisArg, toReactive, arguments)
  },

  findLastIndex(
    fn: (item: unknown, index: number, array: unknown[]) => boolean,
    thisArg?: unknown
  ) {
    return apply(this, 'findLastIndex', fn, thisArg, undefined, arguments)
  },

  // ✨flat，flatMap 底层走的遍历器接口，因而无需重载
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement

  forEach(
    fn: (item: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown
  ) {
    return apply(this, 'forEach', fn, thisArg, undefined, arguments)
  },

  includes(...args: unknown[]) {
    return searchProxy(this, 'includes', args)
  },

  indexOf(...args: unknown[]) {
    return searchProxy(this, 'indexOf', args)
  },

  join(separator?: string) {
    return reactiveReadArray(this).join(separator)
  },

  // ✨keys() 方法只依赖数组的 length 属性，因而不需要优化
  // keys() iterator only reads `length`, no optimisation required

  lastIndexOf(...args: unknown[]) {
    return searchProxy(this, 'lastIndexOf', args)
  },

  map(
    fn: (item: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown
  ) {
    return apply(this, 'map', fn, thisArg, undefined, arguments)
  },

  pop() {
    return noTracking(this, 'pop')
  },

  push(...args: unknown[]) {
    return noTracking(this, 'push', args)
  },

  reduce(
    fn: (
      acc: unknown,
      item: unknown,
      index: number,
      array: unknown[]
    ) => unknown,
    ...args: unknown[]
  ) {
    return reduce(this, 'reduce', fn, args)
  },

  reduceRight(
    fn: (
      acc: unknown,
      item: unknown,
      index: number,
      array: unknown[]
    ) => unknown,
    ...args: unknown[]
  ) {
    return reduce(this, 'reduceRight', fn, args)
  },

  shift() {
    return noTracking(this, 'shift')
  },

  // slice could use ARRAY_ITERATE but also seems to beg for range tracking

  some(
    fn: (item: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown
  ) {
    return apply(this, 'some', fn, thisArg, undefined, arguments)
  },

  splice(...args: unknown[]) {
    return noTracking(this, 'splice', args)
  },

  toReversed() {
    // @ts-expect-error user code may run in es2016+
    return reactiveReadArray(this).toReversed()
  },

  toSorted(comparer?: (a: unknown, b: unknown) => number) {
    // @ts-expect-error user code may run in es2016+
    return reactiveReadArray(this).toSorted(comparer)
  },

  toSpliced(...args: unknown[]) {
    // @ts-expect-error user code may run in es2016+
    return (reactiveReadArray(this).toSpliced as any)(...args)
  },

  unshift(...args: unknown[]) {
    return noTracking(this, 'unshift', args)
  },

  values() {
    return iterator(this, 'values', toReactive)
  }
}

/**
 * ✨拦截遍历器接口，涉及的操作：keys(),values(),entries(),forof循环,数组解构
 * ✨遍历器的 dep 为: ARRAY_ITERATE_KEY
 * ✨至于其他像 forEach,map,filter 方法底层都没有调用遍历器接口，而是普通的 for 循环
 */
// instrument iterators to take ARRAY_ITERATE dependency
function iterator(
  self: unknown[],
  method: keyof Array<unknown>,
  wrapValue: (value: any) => unknown
) {
  // note that taking ARRAY_ITERATE dependency here is not strictly equivalent
  // to calling iterate on the proxified array.
  // creating the iterator does not access any array property:
  // it is only when .next() is called that length and indexes are accessed.
  // pushed to the extreme, an iterator could be created in one effect scope,
  // partially iterated in another, then iterated more in yet another.
  // given that JS iterator can only be read once, this doesn't seem like
  // a plausible use-case, so this tracking simplification seems ok.
  // ✨注意这里，对整个数据对象只 track 一次
  const arr = shallowReadArray(self)
  const iter = (arr[method] as any)() as IterableIterator<unknown> & {
    _next: IterableIterator<unknown>['next']
  }
  if (arr !== self && !isShallow(self)) {
    // ✨对每个生成器的返回值进行响应式转换
    iter._next = iter.next
    iter.next = () => {
      const result = iter._next()
      if (result.value) {
        result.value = wrapValue(result.value)
      }
      return result
    }
  }
  return iter
}

// in the codebase we enforce es2016, but user code may run in environments
// higher than that
type ArrayMethods = keyof Array<any> | 'findLast' | 'findLastIndex'

// ✨数组的方法都是部署在 Array 原型上的
const arrayProto = Array.prototype

// ✨重载常见的数组遍历和查找方法，这些方法的共同点是：参数都是一个回调函数。
// ✨因而需要对回调函数中的传入的值进行响应式转换
// instrument functions that read (potentially) all items
// to take ARRAY_ITERATE dependency
function apply(
  self: unknown[],
  method: ArrayMethods,
  fn: (item: unknown, index: number, array: unknown[]) => unknown,
  thisArg?: unknown,
  wrappedRetFn?: (result: any) => unknown,
  args?: IArguments
) {
  const arr = shallowReadArray(self)
  const needsWrap = arr !== self && !isShallow(self)
  // @ts-expect-error our code is limited to es2016 but user code is not
  const methodFn = arr[method]

  // #11759
  // If the method being called is from a user-extended Array, the arguments will be unknown
  // (unknown order and unknown parameter types). In this case, we skip the shallowReadArray
  // handling and directly call apply with self.
  if (methodFn !== arrayProto[method as any]) {
    // ✨该条件成立的情况是：用户对数组原型添加了自定义方法
    // ✨对于自定义方法，只对返回结果进行响应式转换
    const result = methodFn.apply(self, args)
    return needsWrap ? toReactive(result) : result
  }

  let wrappedFn = fn
  if (arr !== self) {
    // ✨arr !== self 说明当前方法是在一个响应式数组上调用的
    if (needsWrap) {
      // ✨回调函数中，只对 value 数组成员进行响应式转换
      // ✨不对 index 转换，是因为 index 是 number 类型,无法转换
      // ✨至于 self，因为如果能进入这个判断，self 已经被转换过了
      wrappedFn = function (this: unknown, item, index) {
        return fn.call(this, toReactive(item), index, self)
      }
    } else if (fn.length > 2) {
      // ✨fn.length > 2 表明用户在回调函数中用到了数组本身
      // ✨而在这里数组本身就是一个响应式对象，因而不需要在对数组成员进行响应式转换
      wrappedFn = function (this: unknown, item, index) {
        return fn.call(this, item, index, self)
      }
    }
  }

  const result = methodFn.call(arr, wrappedFn, thisArg)
  // ✨对 filter,find,findLast 方法的返回值进行响应式转换
  // ✨因为这3个方法的返回值是原数组的成员对象
  // ✨原数组成员本身是不具备响应性的，只有通过代理后的数组访问才具有，因而返回值需要包装

  // ✨而对于 map，我们是直接在回调函数中返回数组成员，在回调中访问到的数组成员都是具有响应性的
  // ✨因此，不需要对 map 方法的返回值进行转换
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result
}

// instrument reduce and reduceRight to take ARRAY_ITERATE dependency
// ✨重载 reduce 相关方法，逻辑同上
function reduce(
  self: unknown[],
  method: keyof Array<any>,
  fn: (acc: unknown, item: unknown, index: number, array: unknown[]) => unknown,
  args: unknown[]
) {
  const arr = shallowReadArray(self)
  let wrappedFn = fn
  if (arr !== self) {
    if (!isShallow(self)) {
      wrappedFn = function (this: unknown, acc, item, index) {
        return fn.call(this, acc, toReactive(item), index, self)
      }
    } else if (fn.length > 3) {
      wrappedFn = function (this: unknown, acc, item, index) {
        return fn.call(this, acc, item, index, self)
      }
    }
  }
  return (arr[method] as any)(wrappedFn, ...args)
}

// instrument identity-sensitive methods to account for reactive proxies
// ✨重载 includes,indexOf,lastIndexOf 这3个查找方法
// ✨注意到这3个查找方法与其他查找方法不同，它们的参数是一个具体值，而不是回调函数
function searchProxy(
  self: unknown[],
  method: keyof Array<any>,
  args: unknown[]
) {
  const arr = toRaw(self) as any
  track(arr, TrackOpTypes.ITERATE, ARRAY_ITERATE_KEY)
  // we run the method using the original args first (which may be reactive)
  // ✨先用参数的传入版本(可能具备响应性)运行一次
  const res = arr[method](...args)

  // if that didn't work, run it again using raw values.
  // ✨如果不起作用，再用参数的原始版本(不具备响应性)运行一次
  if ((res === -1 || res === false) && isProxy(args[0])) {
    args[0] = toRaw(args[0])
    return arr[method](...args)
  }

  return res
}

// instrument length-altering mutation methods to avoid length being tracked
// which leads to infinite loops in some cases (#2137)
// ✨重载会原地修改数组的方法
// ✨这类像 push,pop 的方法会同时触发 length 属性的 get和 set，因而需要避免 length 属性的循环追踪
function noTracking(
  self: unknown[],
  method: keyof Array<any>,
  args: unknown[] = []
) {
  pauseTracking()
  startBatch()
  const res = (toRaw(self) as any)[method].apply(self, args)
  endBatch()
  resetTracking()
  return res
}
```
