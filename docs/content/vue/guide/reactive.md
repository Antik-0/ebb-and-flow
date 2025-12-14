# Vue 响应式系统 - Reactive

::custom-block{title='前言'}
本文解析的 vue 源码版本为 `3.4.27`，只涉及包 `packages/reactivity` 下的内容，一般文章的标题就是其对应的源码模块。

推荐先阅读 vue 官方文档-[深入响应式系统](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)，理解 dep(依赖)、effect(作用)等相关术语，这将有助于更好的理解 vue 响应式系统。

**vue3** 响应式系统的基础是 Proxy，关于 Proxy 的知识可查看[阮一峰老师的教程](https://wangdoc.com/es6/proxy)。

为了行文方便，下文中出现 `reactive` 这个词有时候并不是特指 `reactive` 这个函数，更多的是表示一个对象被 `reactive、readonly` 等响应式函数包装后具有了 vue 的响应性，是泛指这一系列代理，具体意思根据上下文会有所不同。
::

## reactive

首先我们从最基础的函数 `reactive` 入手，其入口代码如下：

```ts
export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  // ✨如果target已存在只读代理，返回只读代理
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}
```

响应式代理由于要处理不同的数据类型以及一些边界问题，实际经过了多层的函数逻辑处理。由于其响应式的代理逻辑并不在 `reactive.ts` 这个模块，因而本文先暂不涉及其代理逻辑，主要分析 `reactive` 函数的边界问题。

## createReactiveObject

```ts
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) {
    if (__DEV__) {
      warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  // ✨target已经是一个响应式代理，直接返回
  // ✨例外：readonly(reactive(target))
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    // ✨如果target[ReactiveFlags.RAW]为true表明target已经是一个响应式对象了
    return target
  }

  // target already has corresponding Proxy
  // ✨target已存在响应式代理
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // only specific value types can be observed.
  // ✨对target的类型进行过滤
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }

  // ✨Object/Array类型，使用baseHandlers处理
  // ✨Map/Set类型，使用collectionHandlers处理
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )

  // ✨缓存代理对象至对应的map
  proxyMap.set(target, proxy)
  return proxy
}
```

`createReactiveObject` 函数总体来说很简单，主要是先对代理对象 `target` 参数进行一些类型上的边界处理，其中有几个关注点，下面进行说明。

## ReactiveFlags

`createReactiveObject` 开头使用了一个 `ReactiveFlags` 对象，这是一个 `ts` 的枚举对象，其定义以及相应属性涉及的常见工具函数如下：

```ts
export enum ReactiveFlags {
  SKIP = '__v_skip', // 跳过代理 => markRaw()
  IS_REACTIVE = '__v_isReactive', // 响应 => reactive() | shallowReactive()
  IS_READONLY = '__v_isReadonly', // 只读 => readonly() | shallowReadonly()
  IS_SHALLOW = '__v_isShallow', // 浅层 => shallowReactive() | shallowReadonly()
  RAW = '__v_raw' // 返回代理的原始target => toRaw()
}
```

该枚举的成员只有 `ReactiveFlags.SKIP` 是真正赋值到了代理对象上，其余都是非常巧妙的通过 `proxy.get` 进行了代理，详情将在 **BaseHandlers** 文章中解释。

了解了上述 `ReactiveFlags` 枚举的定义后，我们再来看下面这个表达式成立的条件：

> `!(isReadonly && target[ReactiveFlags.IS_REACTIVE])`

```ts
const a = reactive({}) // isReactive(a) => true
const b = shallowReactive(a) // isReactive(b) => true

console.log(a === b) // true
console.log(readonly(a) === a) // false
console.log(readonly(b) === b) // false
console.log(shallowReadonly(a) === a) // false
console.log(shallowReadonly(b) === b) // false
```

从上述例子中可以看到，如果对 `target` 进行 **readonly** 代理，同时 `target` 已经是一个 `reactive` 的话，那么 `!(isReadonly && target[ReactiveFlags.IS_REACTIVE])` 条件的结果就为 `false`。这个条件的作用请看下述例子：

```ts
const a = reactive({ id: 1 })
const b = readonly(a)
watch(b, () => {
  console.log('watch => ', b.id)
})
a.id += 1 // 触发watch
b.id += 1 // 警告：b是一个只读对象，不会触发watch
```

从例子中可以看到：`b` 是一个只读版本的代理，因此不能修改 `b` 的任何属性，但同时 `b` 代理的对象 `a` 是一个响应式对象，因此直接修改 `a` 身上的属性，也能触发依赖 `b` 属性的 effect(即 watch)，这样就保证了 `readonly(reactive(target))` 这样调用既具备只读的特性，也保留了对象的响应性，而如果只是 `readonly(target)` 这样调用，意味着只是单纯的只读，不会进行任何的依赖收集。

## TargetType

在 `createReactiveObject` 函数中还使用了 `getTargetType(target)` 这个函数来获取 `target` 类型，从而进行过滤操作，其涉及的源码如下：

```ts
enum TargetType {
  INVALID = 0, // 无效类型
  COMMON = 1, // 普通对象对象
  COLLECTION = 2 // 集合类型
}

function targetTypeMap(rawType: string) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}

// ✨如果value被markRaw()包装过，或是不可扩展的，返回TargetType.INVALID，跳过代理
function getTargetType(value: Target) {
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
    ? TargetType.INVALID
    : targetTypeMap(toRawType(value))
}
```

从上述代码可以看到：如果对象具有 `ReactiveFlags.SKIP` 属性或是 `不可扩展` 的，那么将视为无效类型，同时 vue 对广义上的对象代理的类型只包含了 `Object、Array、Map、Set、WeakMap、WeakSet` 这六个，其中 `Object/Array` 属于普通对象，而剩下四个聚合类型属于集合对象，在 `createReactiveObject` 函数中会分别对这两种分类使用不同的 `ProxyHandlers`。

```ts
function createReactiveObject(
  ...
) {
  ...
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers,
  )
  proxyMap.set(target, proxy)
  return proxy
}
```

## Reactive：函数

在了解 `createReactiveObject` 函数后，下面给出 vue 中 4 个响应式函数的定义如下：

```ts
// COMMON 类型的 handlers
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'
// COLLECTION 类型的 handlers
import {
  mutableCollectionHandlers,
  readonlyCollectionHandlers,
  shallowCollectionHandlers,
  shallowReadonlyCollectionHandlers
} from './collectionHandlers'

// ...

/**
 * 存储4种响应式代理对象的map
 * 使用WeakMap存储，垃圾回收不会考虑WeakMap对target的引用
 * https://wangdoc.com/es6/set-map#weakset
 */
export const reactiveMap = new WeakMap<Target, any>()
export const shallowReactiveMap = new WeakMap<Target, any>()
export const readonlyMap = new WeakMap<Target, any>()
export const shallowReadonlyMap = new WeakMap<Target, any>()

// ...

export function reactive(target: object) {
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}

export function shallowReactive<T extends object>(
  target: T
): ShallowReactive<T> {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  )
}

export function readonly<T extends object>(
  target: T
): DeepReadonly<UnwrapNestedRefs<T>> {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  )
}

export function shallowReadonly<T extends object>(target: T): Readonly<T> {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  )
}
```

## Reactive：工具

在 `reactive.ts` 模块中，还暴露了一些工具 API，因为其定义都很简单，因此直接贴出代码即可。

```ts
// ✨检查value是否是由 reactive()、shallowReactive() 创建的代理
export function isReactive(value: unknown): boolean {
  if (isReadonly(value)) {
    return isReactive((value as Target)[ReactiveFlags.RAW])
  }
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

// ✨检查value是否为只读代理。
export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

// ✨检查value是否是由 reactive()、readonly()、shallowReactive()、shallowReadonly() 创建的代理。
export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}

// ✨返回vue响应代理的原始对象
export function toRaw<T>(observed: T): T {
  /**
   * 只有经过reactive等工具代理过的target，才会触发 ReactiveFlags.RAW 这个属性的get拦截
   * 只要返回的raw变量不是undefined，就说明observed还是一个vue的响应代理对象
   */
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}

// ✨将一个对象标记为不可被转为代理，详情见vue官方：
// ✨https://cn.vuejs.org/api/reactivity-advanced.html#markraw
export function markRaw<T extends object>(value: T): Raw<T> {
  // ✨def函数是Object.defineProperty的别名
  // ✨因此这里是真正的设置了 ReactiveFlags.SKIP 这个属性到value对象上
  if (Object.isExtensible(value)) {
    def(value, ReactiveFlags.SKIP, true)
  }
  return value
}

export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value

export const toReadonly = <T extends unknown>(value: T): T =>
  isObject(value) ? readonly(value) : value
```

## 结语

以上就是 `reactive.ts` 模块的主要内容，该模块主要是暴露了 4 个响应式函数以及一些响应式工具，同时对响应式对象的类型边界进行处理，并引入了不同数据类型对应的 `ProxyHandler`。其中 `COMMON` 类型的代理逻辑在 `baseHandlers.ts` 模块，`COLLECTION` 类型的代理逻辑在 `collectionHandlers.ts` 模块，接下来将分析 `baseHandlers.ts` 模块，即 vue 是如何代理 `Object/Array` 类型的对象。
