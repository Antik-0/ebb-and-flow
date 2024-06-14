# Vue 源码解析之-Ref

## ref

`Ref` 可以持有任何类型的值，包括深层嵌套的对象、数组或者 JavaScript 内置的数据结构，其入口代码如下：

```ts
export function ref(value?: unknown) {
  return createRef(value, false)
}

export function shallowRef(value?: unknown) {
  return createRef(value, true)
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```

从 `ref` 和 `shallowRef` 的 `ts` 接口可以看到，其参数 `value` 是一个可选参数，因此直接调用 `ref()` 也是合法的，这将返回一个值为 `undefined` 的 `ref`。 同时两个函数的核心是一个 `RefImpl` 类，源码如下：

```ts
class RefImpl<T> {
  private _value: T
  private _rawValue: T

  // ✨依赖，该依赖指的是ref.value这个依赖
  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    // ✨reactive mode 保存value的raw版本，返回value的reactive版本
    // ✨shallow mode 不做任何转换
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    // ✨tarck依赖
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    // ✨如果ref是shallow，或者set的value是shallow或readonly
    // ✨那么不对newVal进行toRaw操作
    const useDirectValue =
      this.__v_isShallow || isShallow(newVal) || isReadonly(newVal)
    newVal = useDirectValue ? newVal : toRaw(newVal)

    // ✨hasChanged内部使用Object.is来判断两个值是否发生变化
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = useDirectValue ? newVal : toReactive(newVal)
      // ✨trriger依赖
      triggerRefValue(this, DirtyLevels.Dirty, newVal)
    }
  }
}
```

`RefImpl` 类的逻辑很简单，只提供了一个 `.value` 属性的 `getter` 和 `setter`，然后在 `getter` 中追踪依赖，在 `setter` 中触发依赖该 `ref` 的 effects。在构造器 `constructor` 中，对于 `.value` 的响应式转换是通过 `toReactive` 函数进行，`toReactive` 函数的源码非常简单，只有一行：

> `toReactive = (value) => isObject(value) ? reactive(value) : value`

可以看到，如果传入 `ref` 的值是一个对象，那么其转换由 `reactive` 函数接管，如果是原始类型，则直接返回。

对于 `trackRefValue` 和 `triggerRefValue` 这两个处理 **effects** 的函数，这里先不展开分析，放到后面 effects 章节再进行讲解。同时在 `ref.ts` 模块中还提供了一些响应式工具，这些工具很常用，因此下面进行介绍。

## 响应式：工具

```ts
// ✨检查对象上的__v_isRef属性是否为true
export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true)
}

// ✨ref解包
export function unref<T>(ref: MaybeRef<T> | ComputedRef<T>): T {
  return isRef(ref) ? ref.value : ref
}

// ✨在unref的基础上，处理参数为一个getter函数的情况
export function toValue<T>(source: MaybeRefOrGetter<T> | ComputedRef<T>): T {
  return isFunction(source) ? source() : unref(source)
}

// ✨强制触发依赖该ref的effects，其中的关键是DirtyLevels.Dirty
export function triggerRef(ref: Ref) {
  triggerRefValue(ref, DirtyLevels.Dirty, __DEV__ ? ref.value : void 0)
}

// ✨shallow ref 的自动解包处理
const shallowUnwrapHandlers: ProxyHandler<any> = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key]
    // ✨只有oldValue是一个ref，value不是ref才进行自动解包赋值
    // ✨如果将一个新的ref赋值给一个关联了已有ref的属性，那么会替换掉旧的ref
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value
      return true
    } else {
      return Reflect.set(target, key, value, receiver)
    }
  }
}

export function proxyRefs<T extends object>(
  objectWithRefs: T
): ShallowUnwrapRef<T> {
  // ✨将一个根属性都是ref的对象转为一个代理对象
  // ✨该代理对象是shallow的，同时具备ref的自动解包功能
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers)
}
```

### customRef

vue 还提供了自定义 `ref` 的功能，即 `customRef` 函数。

```ts
export function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
  return new CustomRefImpl(factory) as any
}

class CustomRefImpl<T> {
  public dep?: Dep = undefined
  private readonly _get: ReturnType<CustomRefFactory<T>>['get']
  private readonly _set: ReturnType<CustomRefFactory<T>>['set']
  public readonly __v_isRef = true

  constructor(factory: CustomRefFactory<T>) {
    const { get, set } = factory(
      () => trackRefValue(this),
      () => triggerRefValue(this)
    )
    this._get = get
    this._set = set
  }

  get value() {
    return this._get()
  }

  set value(newVal) {
    this._set(newVal)
  }
}
```

其源码简单，没有需要特殊说明的地方，具体使用见[官方文档](https://cn.vuejs.org/api/reactivity-advanced.html#customref)即可。

## 转换工具

`ref.ts` 模块中还有两个重要的转换工具 `toRef` 和 `toRefs`，下面进行介绍。

### toRef

```ts
// ✨toRef的ts接口很长，此处省略
export function toRef(
  source: Record<string, any> | MaybeRef,
  key?: string,
  defaultValue?: unknown
): Ref {
  if (isRef(source)) {
    // ✨传入的source已经是一个ref
    return source
  } else if (isFunction(source)) {
    // ✨传入的source是一个getter函数，返回一个只读的ref
    return new GetterRefImpl(source) as any
  } else if (isObject(source) && arguments.length > 1) {
    // ✨传入的source是一个对象，同时带有key，将指定的属性值作为.value的值
    return propertyToRef(source, key!, defaultValue)
  } else {
    // ✨将传入的值作为.value，等同于直接调用ref
    return ref(source)
  }
}
```

`toRef` 根据传参的不同有 4 种返回情况，我们关注的是第 2/3 种的 if 条件。

首先是第 2 种，该 `if` 转换的对象是一个 `getter函数`，`toRef` 会返回一个只有 **getter** 代理的 `ref`，即 `readonly` 版本的 `ref` 对象。其构造类 `GetterRefImpl` 的源码如下：

```ts
class GetterRefImpl<T> {
  public readonly __v_isRef = true
  public readonly __v_isReadonly = true
  constructor(private readonly _getter: () => T) {}
  get value() {
    return this._getter()
  }
}
```

由于是 `readonly` 的，因此无需 `track/trigger` 操作，代码十分简单。根据官方文档的介绍，这种情况主要在：把一个 prop 的属性作为 ref 传递给一个组合式函数时会很有用。[toRef 介绍](https://cn.vuejs.org/api/reactivity-utilities.html#toref)

接着是第 3 种情况，此种情况要求入参的 `soure` 是一个 `Object` 类型，同时要需要传入 `key` 参数，表明要转换对象的哪个属性。其转换函数 `propertyToRef` 的源码如下：

```ts
// ✨将对象的属性转为一个ref类型
function propertyToRef(
  source: Record<string, any>,
  key: string,
  defaultValue?: unknown
) {
  const val = source[key]
  return isRef(val)
    ? val
    : (new ObjectRefImpl(source, key, defaultValue) as any)
}

class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(
    private readonly _object: T,
    private readonly _key: K,
    private readonly _defaultValue?: T[K]
  ) {}

  get value() {
    const val = this._object[this._key]
    return val === undefined ? this._defaultValue! : val
  }

  set value(newVal) {
    this._object[this._key] = newVal
  }

  get dep(): Dep | undefined {
    return getDepFromReactive(toRaw(this._object), this._key)
  }
}
```

通过观察 `ObjectRefImpl` 的 `getter/setter`，我们可以发现一个点，就是：`ObjectRefImpl` 内部也没有进行 `track/trigger` 操作，其 `get/set` 操作都是直接作用在原对象上，因此如果传入的 `object` 参数不是一个 `reactive`，那么返回的 `ref` 实例也就不是响应式的。

```ts
const target = toRef({ id: 1 }, 'id')
watchEffect(() => {
  console.log('>>>', target.value)
})
// 不会再次触发watchEffect，因为result不是一个响应式ref
target.value = 100
```

并且这种情况的 `toRef` 转换还可以接收第三个参数 `defaultValue`，这点在 vue 的文档中是没有提到的。

### toRefs

`toRefs` 将一个响应式对象转换为一个普通对象，转换后的对象的每个根属性都是指向源对象相应属性的 `ref`。

```ts
export function toRefs<T extends object>(object: T): ToRefs<T> {
  // ✨toRefs转换应该作用于一个reactive代理对象上
  if (__DEV__ && !isProxy(object)) {
    warn(`toRefs() expects a reactive object but received a plain one.`)
  }
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = propertyToRef(object, key)
  }
  return ret
}
```

从源码中可以看到，`toRefs` 的转换就是 `toRef` 的第三种情况，都是用的 `propertyToRef` 方法，但是缺少了 `defaultValue` 参数，同时，前面我们已经知道，`propertyToRef` 方法内部并没有强制要求转换的对象是一个 `reactive`，而 `toRefs` 应该被用于 `reactive` 对象的转换，因此方法首先是对 `object` 参数做了一个 `isProxy` 的检查。

此外小提一点，官方文档指出：每个单独的 `ref` 都是使用 `toRef()` 创建的。但查看源码后得知，其实是通过 `propertyToRef` 函数创建的，不过其根本都是一样的。

## 结语

为了实现原始类型的响应式，`ref` 通过提供一个 `.value` 的访问接口，来实现对象属性的访问，其本质就是一个对象，但是同时兼容了原始类型。对于 `ref` 实例，有一个 `dep` 属性本文没有提及，关于这点将会在下篇文章进行补充，因此接下来将对 **effect** 的概念进行介绍，分析 vue 的响应式系统是如何进行 **track** 和 **trigger** 操作的。
