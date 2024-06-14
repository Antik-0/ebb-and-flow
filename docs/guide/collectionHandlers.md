# Vue 源码解析之-CollectionHandlers

对于 `Map/Set` 等集合对象的代理与一般对象不同的是，集合对象的增删改查都是通过对象上的方法进行操作的，因此与数组方法的代理一样，需要对涉及的方法进行重载，其中涉及的方法一共有以下 7 个：

> `get()、set()、has()、size、add()、delete()、clear()`

## get

```ts
function get(
  target: MapTypes,
  key: unknown,
  isReadonly = false,
  isShallow = false
) {
  // #1772: readonly(reactive(Map)) should return readonly + reactive version
  // of the value
  // ✨先对target进行一次获取.RAW操作，是为了保证
  // ✨readonly(reactive(Map))能过够同时具有readonly + reactive特性
  target = (target as any)[ReactiveFlags.RAW]

  // ✨获取target和key的raw版本，兼容key为raw版本的情况
  const rawTarget = toRaw(target)
  const rawKey = toRaw(key)
  if (!isReadonly) {
    // ✨如果是readonly，不进行track，因为无法修改
    // ✨同时对key的原始和reactive版本进行track
    if (hasChanged(key, rawKey)) {
      // ✨这里hasChanged为true的情况就是key经过了响应式代理
      track(rawTarget, TrackOpTypes.GET, key)
    }
    track(rawTarget, TrackOpTypes.GET, rawKey)
  }
  const { has } = getProto(rawTarget)

  // ✨对返回值进行相应的转换
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive
  if (has.call(rawTarget, key)) {
    return wrap(target.get(key))
  } else if (has.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey))
  } else if (target !== rawTarget) {
    // #3602 readonly(reactive(Map))
    // ensure that the nested reactive `Map` can do tracking for itself
    // 注意此if有两个条件：
    // 1、key和rawKey不存在于rawTarget上
    // 2、target !== rawTarget
    // ✨此时target是一个reactive，调用get是为了保证能track reactive代理
    target.get(key)
  }
}
```

对于 `get` 方法，有一个关注点：`target` 的指向问题。

### target 指向

```ts
const raw = new Map()
const reactiveProxy = reactive(raw)
watchEffect(() => {
  console.log('>>>', reactiveProxy.get(1))
})

const readonlyProxy = readonly(reactiveProxy)
watchEffect(() => {
  console.log('>>>', readonlyProxy.get(1))
})
```

在上述例子中，`reactiveProxy` 是一个 Map 对象的 `reactive` 代理版本，当 `watchEffect` 中进行 `reactiveProxy.get(1)` 触发代理时，在 `get` 方法中，其参数的 `target` 指向的是变量 `reactiveProxy`，然后经过一次 `.RAW` 操作，`target` 指向了变量 `raw`。

接着对于 `readonlyProxy` 变量，其在 `reactiveProxy` 变量的基础上，又添加了一层 `readonly` 代理，当 `watchEffect` 中进行 `readonlyProxy.get(1)` 触发代理时，在 `get` 方法中，其参数的 `target` 指向的是变量 `readonlyProxy`，然后同样经过一次 `.RAW` 操作，此时 `target` 指向了变量 `reactiveProxy`，而 `rawTarget` 还是指向变量 `raw`。

通过上述分析，当经过多次不同版本的代理嵌套，`get` 方法内部的 `target` 指向是有区别的，这种区别的作用请看下述例子：

```ts
const raw = new Map()
const reactiveProxy = reactive(raw)
const readonlyProxy = readonly(reactiveProxy)

watchEffect(() => {
  console.log('>>>', readonlyProxy.get(1))
})

setTimeout(() => {
  reactiveProxy.set(1, 1)
}, 1000)

// >>> undefined
// >>> 1
```

上述例子中，我们通过 `watchEffect` 创建了一个 effect，其依赖是 **key=1**。但是，由于 `readonlyProxy` 是一个 `readonly` 代理，因此我们无法通过 `readonlyProxy.set` 去修改 **key=1** 对应的值。然而，由于 `readonlyProxy` 代理的 `target` 是一个 `reactive` 代理，因此可以通过 `reactiveProxy.set(1, 1)` 来进行 `trriger`，这是合法的，并且也能成功触发 effect 的更新。

此时，当运行到 `watchEffect` 代码块时 `get` 方法内部的执行情况是这样的：首先 `target` 指向了 `reactiveProxy` 变量，`rawTarget` 指向 `raw` 变量，同时 get 是在一个 `readonly` 代理版本上调用的，因此 `!isReadonly === true`，跳过了对 `rawTarget` 的 track，并且由于 `raw` 是一个空 Map，不存在任何 key，所以执行最后一个 if 语句 `else if (target !== rawTarget)`，通过调用 `target.get(key)` 来触发 `reactive` 代理版本的依赖收集。

这就是作者注释所说的：

> readonly(reactive(Map)) should return readonly + reactive version of the value
>
> ensure that the nested reactive `Map` can do tracking for itself

而实现上述功能的就是如下关键代码:

```ts
function get() {
  target = (target as any)[ReactiveFlags.RAW]
  // ...
  else if (target !== rawTarget) {
    target.get(key)
  }
}
```

如果是 `readonlyProxy = readonly(raw)` 这样创建的 `readonly` 代理版本是不会触发任何依赖的收集的，因为无法为其增加或修改任何属性。

::: tip
特别注意的是，最后一个 if 语句没有经过 wrap 包装，也没有进行 return，原因是由于这个 if 条件就是针对 `readonly(reactive(Map))` 这个情况，此时条件中的 `target` 已经是一个 `reactive` 代理了，如果再进行一层 readonly wrap，那么就破坏了 `reactive` 的特性。而没有 return 是因为此条件的前置条件是 key 不存在 rawTarget Map 中，`target.get(key)` 的结果为 undefined，是否显示 return 都是返回 undefined。
:::

综上所述：对于 `Map/Set` 对象的 `get` 拦截，如果是 `readonly(Map)` 代理，则不会进行任何 `key` 的依赖追踪，但如果是 `readonly(reactive(Map))` 情况，则需要返回一个 **_readonly + reactive_** 版本的代理对象。

## set

```ts
function set(this: MapTypes, key: unknown, value: unknown) {
  // ✨Map中存储的都是value的raw版本
  value = toRaw(value)
  const target = toRaw(this)
  const { has, get } = getProto(target)

  let hadKey = has.call(target, key)
  if (!hadKey) {
    // ✨若key的reactive版本不存在，则使用raw版本再判断一次
    key = toRaw(key)
    hadKey = has.call(target, key)
  } else if (__DEV__) {
    // ✨checkIdentityKeys内部会进行一个判断：
    // ✨若target同时存在raw版本和reactive版本的key，并通过reactive版本的key进行set则会发出警告
    checkIdentityKeys(target, has, key)
  }

  // ✨oldValue供调试使用
  const oldValue = get.call(target, key)
  target.set(key, value)

  // ✨根据key是否已存在，区别trigger的类型
  if (!hadKey) {
    trigger(target, TriggerOpTypes.ADD, key, value)
  } else if (hasChanged(value, oldValue)) {
    trigger(target, TriggerOpTypes.SET, key, value, oldValue)
  }
  return this
}
```

关于 `set` 中的 `checkIdentityKeys` 函数，其源码如下：

```ts
function checkIdentityKeys(
  target: CollectionTypes,
  has: (key: unknown) => boolean,
  key: unknown
) {
  const rawKey = toRaw(key)
  if (rawKey !== key && has.call(target, rawKey)) {
    // ✨key经过代理，同时target又存在原始版本的rawKey
    const type = toRawType(target)
    warn(
      `Reactive ${type} contains both the raw and reactive ` +
        `versions of the same object${type === `Map` ? ` as keys` : ``}, ` +
        `which can lead to inconsistencies. ` +
        `Avoid differentiating between the raw and reactive versions ` +
        `of an object and only use the reactive version if possible.`
    )
  }
}
```

当代理的 Map 对象同时存在原始版本和代理版本的 `key`，并通过 **代理版本** 的 `key` 进行 `set` 赋值操作则会触发这个函数的警告，警告的内容提示这样操作可能会造成不一致的情况，应当尽可能的使用 **reactive version** 的 `key`。

```ts :line-numbers
const raw = new Map()
const key1 = {}
const key2 = reactive(key1)
raw.set(key1, 1)
raw.set(key2, 2)

const reactiveProxy = reactive(raw)
reactiveProxy.set(key2, 200)
```

上述例子中：代理的原始对象 `raw` 有两个 key，其中 `key2` 是 `key1` 的 **reactive** 版本，因而当执行第 8 行的 set 赋值后，就会调用 `checkIdentityKeys` 并发出警告。

对于警告中的：

> only use the reactive version if possible

我的理解是，在代理的原始对象 `target` 中，不应该存在 `reactive` 版本的 `key`。

以上述例子来说就是，第 5 行代码是不合理的，不应该直接通过 `raw` 对象来设置 `key2` 这个 **reactive version** 的键，而是应该通过 vue 的响应式代理对象，即第 8 行代码进行操作。理由在于 `set` 代理方法中，会进行 `key = toRaw(key)` 转换，从而保证代理的原始对象 `target` 中的所有对象 `key` 都是普通对象，而不是 vue 的响应式对象。或者说，设置 `reactive` 版本的 key 通常是没有意义的，key 只是作为 value 的索引，其本质含义不会因为经过 reactive，readonly 等代理而转变，除非真的有什么特殊需求。

## has

```ts
function has(this: CollectionTypes, key: unknown, isReadonly = false): boolean {
  // ✨兼容readonly(reactive(Map))
  const target = (this as any)[ReactiveFlags.RAW]
  const rawTarget = toRaw(target)
  const rawKey = toRaw(key)
  if (!isReadonly) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, TrackOpTypes.HAS, key)
    }
    track(rawTarget, TrackOpTypes.HAS, rawKey)
  }
  return key === rawKey
    ? target.has(key)
    : target.has(key) || target.has(rawKey)
}
```

## size

```ts
function size(target: IterableCollections, isReadonly = false) {
  // ✨兼容readonly(reactive(Map))
  target = (target as any)[ReactiveFlags.RAW]

  // ✨注意track的key为ITERATE_KEY，这是一个常量，而不是size
  !isReadonly && track(toRaw(target), TrackOpTypes.ITERATE, ITERATE_KEY)
  return Reflect.get(target, 'size', target)
}
```

## add

```ts
function add(this: SetTypes, value: unknown) {
  // ✨Set中存储的都是value的raw版本
  value = toRaw(value)
  const target = toRaw(this)
  const proto = getProto(target)
  const hadKey = proto.has.call(target, value)
  if (!hadKey) {
    target.add(value)
    trigger(target, TriggerOpTypes.ADD, value, value)
  }
  return this
}
```

## delete

```ts
function deleteEntry(this: CollectionTypes, key: unknown) {
  const target = toRaw(this)
  const { has, get } = getProto(target)
  let hadKey = has.call(target, key)
  if (!hadKey) {
    // ✨兼容reactive版本的key
    key = toRaw(key)
    hadKey = has.call(target, key)
  } else if (__DEV__) {
    checkIdentityKeys(target, has, key)
  }

  const oldValue = get ? get.call(target, key) : undefined
  // forward the operation before queueing reactions
  // ✨在进行trigger之前执行delete操作
  const result = target.delete(key)
  if (hadKey) {
    trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
  }
  return result
}
```

## clear

```ts
function clear(this: IterableCollections) {
  const target = toRaw(this)
  const hadItems = target.size !== 0
  const oldTarget = __DEV__
    ? isMap(target)
      ? new Map(target)
      : new Set(target)
    : undefined
  // forward the operation before queueing reactions
  // ✨在进行trigger之前执行clear操作
  const result = target.clear()
  if (hadItems) {
    trigger(target, TriggerOpTypes.CLEAR, undefined, undefined, oldTarget)
  }
  return result
}
```

## Iterator

由于 `Map/Set` 还实现了 `Iterator` (迭代器)接口，因此除了以上的 7 个方法，还需要对依赖迭代器的方法进行代理拦截，其中涉及到迭代器的使用有以下几种情况：

> `keys(), values(), entries(), forof循环`

vue 通过一个 `createIterableMethod` 函数来实现迭代器的代理拦截，其源码如下：

```ts
function createIterableMethod(
  method: string | symbol,
  isReadonly: boolean,
  isShallow: boolean
) {
  // ✨返回一个包装函数
  return function (
    this: IterableCollections,
    ...args: unknown[]
  ): Iterable & Iterator {
    // ✨兼容readonly(reactive(Map))
    const target = (this as any)[ReactiveFlags.RAW]
    const rawTarget = toRaw(target)
    const targetIsMap = isMap(rawTarget)

    // ✨Map的forof循环等价于entries
    const isPair =
      method === 'entries' || (method === Symbol.iterator && targetIsMap)

    // ✨调用Map.keys()的情况
    const isKeyOnly = method === 'keys' && targetIsMap

    // ✨获取方法的迭代器Iterator
    const innerIterator = target[method](...args)

    // ✨对迭代器返回的值进行相应的响应式转换
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive
    !isReadonly &&
      track(
        rawTarget,
        TrackOpTypes.ITERATE,
        // ✨Map.keys()track的key为MAP_KEY_ITERATE_KEY
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      )
    // return a wrapped iterator which returns observed versions of the
    // values emitted from the real iterator
    // ✨返回一个迭代器接口对象，保证接收到的value都是observed versions
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next()
        return done
          ? { value, done }
          : {
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
              done
            }
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this
      }
    }
  }
}
```

`readonly` 版本的迭代器通过 `createReadonlyMethod` 函数构建，其源码如下：

```ts
function createReadonlyMethod(type: TriggerOpTypes): Function {
  return function (this: CollectionTypes, ...args: unknown[]) {
    if (__DEV__) {
      const key = args[0] ? `on key "${args[0]}" ` : ``
      warn(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      )
    }
    // ✨返回对应操作失败的结果
    return type === TriggerOpTypes.DELETE
      ? false
      : type === TriggerOpTypes.CLEAR
      ? undefined
      : this
  }
}
```

## forEach

除了通过迭代器进行遍历，`Map/Set` 对象上还部署了 `forEach` 方法，其拦截函数如下：

```ts
function createForEach(isReadonly: boolean, isShallow: boolean) {
  return function forEach(
    this: IterableCollections,
    callback: Function,
    thisArg?: unknown
  ) {
    const observed = this as any
    // ✨兼容readonly(reactive(Map))
    const target = observed[ReactiveFlags.RAW]
    const rawTarget = toRaw(target)

    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive
    // ✨readonly模式跳过track
    !isReadonly && track(rawTarget, TrackOpTypes.ITERATE, ITERATE_KEY)

    // ✨对于this对象，需要保证其具有响应性，因此observed应该指向响应式代理对象
    // ✨对value和key进行响应式转换，以保证effect能正确track相关依赖
    return target.forEach((value: unknown, key: unknown) => {
      // important: make sure the callback is
      // 1. invoked with the reactive map as `this` and 3rd arg
      // 2. the value received should be a corresponding reactive/readonly.
      return callback.call(thisArg, wrap(value), wrap(key), observed)
    })
  }
}
```

## 组装

以上就是 `Map/Set` 对象各方法的响应式代理，vue 通过 `createInstrumentations` 函数进行了统一的封装：

```ts
function createInstrumentations() {
  // ✨reactive version
  const mutableInstrumentations: Instrumentations = {
    get(this: MapTypes, key: unknown) {
      return get(this, key)
    },
    // ✨size作为一个属性访问，因此是一个getter调用
    get size() {
      return size(this as unknown as IterableCollections)
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  }

  // ✨shallow version
  const shallowInstrumentations: Instrumentations = {
    get(this: MapTypes, key: unknown) {
      return get(this, key, false, true)
    },
    get size() {
      return size(this as unknown as IterableCollections)
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  }

  // ✨readonly version
  const readonlyInstrumentations: Instrumentations = {
    get(this: MapTypes, key: unknown) {
      return get(this, key, true)
    },
    get size() {
      return size(this as unknown as IterableCollections, true)
    },
    has(this: MapTypes, key: unknown) {
      return has.call(this, key, true)
    },
    add: createReadonlyMethod(TriggerOpTypes.ADD),
    set: createReadonlyMethod(TriggerOpTypes.SET),
    delete: createReadonlyMethod(TriggerOpTypes.DELETE),
    clear: createReadonlyMethod(TriggerOpTypes.CLEAR),
    forEach: createForEach(true, false)
  }

  // ✨shallowReadonly version
  const shallowReadonlyInstrumentations: Instrumentations = {
    get(this: MapTypes, key: unknown) {
      return get(this, key, true, true)
    },
    get size() {
      return size(this as unknown as IterableCollections, true)
    },
    has(this: MapTypes, key: unknown) {
      return has.call(this, key, true)
    },
    add: createReadonlyMethod(TriggerOpTypes.ADD),
    set: createReadonlyMethod(TriggerOpTypes.SET),
    delete: createReadonlyMethod(TriggerOpTypes.DELETE),
    clear: createReadonlyMethod(TriggerOpTypes.CLEAR),
    forEach: createForEach(true, true)
  }

  // ✨迭代器方法重载
  const iteratorMethods = [
    'keys',
    'values',
    'entries',
    Symbol.iterator
  ] as const

  iteratorMethods.forEach(method => {
    mutableInstrumentations[method] = createIterableMethod(method, false, false)
    readonlyInstrumentations[method] = createIterableMethod(method, true, false)
    shallowInstrumentations[method] = createIterableMethod(method, false, true)
    shallowReadonlyInstrumentations[method] = createIterableMethod(
      method,
      true,
      true
    )
  })

  return [
    mutableInstrumentations,
    readonlyInstrumentations,
    shallowInstrumentations,
    shallowReadonlyInstrumentations
  ]
}

const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* #__PURE__*/ createInstrumentations()
```

文章开头提到过，对于 `Map/Set` 对象的操作都是通过方法进行，而访问对象的方法要经过 `get` 代理，因此还需要一层 `proxy.get` 封装，其源码如下：

```ts
function createInstrumentationGetter(isReadonly: boolean, shallow: boolean) {
  // ✨获取各代理版本的方法封装集合
  const instrumentations = shallow
    ? isReadonly
      ? shallowReadonlyInstrumentations
      : shallowInstrumentations
    : isReadonly
    ? readonlyInstrumentations
    : mutableInstrumentations

  // ✨proxy.get的统一处理
  return (
    target: CollectionTypes,
    key: string | symbol,
    receiver: CollectionTypes
  ) => {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.RAW) {
      return target
    }

    // ✨注意：只有Map和Set对象原生的key才具有响应式特性
    // ✨对于往Map和Set实例上添加自定义属性，是不具备响应式的
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target
        ? instrumentations
        : target,
      key,
      receiver
    )
  }
}
```

最后，导出 `collectionHandlers.ts` 模块的 4 个 handlers 如下：

```ts
export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: createInstrumentationGetter(false, false)
}

export const shallowCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: createInstrumentationGetter(false, true)
}

export const readonlyCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: createInstrumentationGetter(true, false)
}

export const shallowReadonlyCollectionHandlers: ProxyHandler<CollectionTypes> =
  {
    get: createInstrumentationGetter(true, true)
  }
```

## 结语

`collectionHandlers.ts` 模块处理了 `Map/Set` 对象的代理，结合 `baseHandlers.ts` 模块对 `Object/Array` 对象的代理，vue 关于对象的响应式代理分析就结束了。

目前为止，关于 `track/trigger` 的逻辑都是直接跳过省略，对于这部分将在后续 **effect** 概念中进行展开，接下来将介绍 vue 关于**原始类型**的响应式处理，即 `ref` 模块。
