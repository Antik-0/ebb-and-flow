# Vue 源码解析之-Computed

当看完前面的 `reactive`，`ref` 和 `effect` 内容后，再来看 `computed` 的内容就简单许多了，同时 `computed` 本身内容也不多，那么话不多说，直接开始吧。

## computed

```ts
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
  isSSR = false
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  // ✨getterOrOptions有getter函数和对象两种类型
  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  // computed只读的条件：入参为getter函数，或没有设置setter
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR)

  if (__DEV__ && debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack
    cRef.effect.onTrigger = debugOptions.onTrigger
  }

  return cRef as any
}
```

`computed` 的入口很简单，只是针对计算属性是否可写做了处理，其底层的构造由 `ComputedRefImpl` 类完成。

## ComputedRefImpl

```ts
export class ComputedRefImpl<T> {
  // ✨与ref一样，computed本身也可作为别的effect的dep
  public dep?: Dep = undefined

  private _value!: T

  // ✨computed本身也是一个effect
  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true
  public readonly [ReactiveFlags.IS_READONLY]: boolean = false

  // ✨是否可缓存，SSR模式下不可缓存
  public _cacheable: boolean

  /**
   * Dev only
   */
  _warnRecursive?: boolean

  constructor(
    private getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean,
    isSSR: boolean
  ) {
    // ✨绑定自身作为一个effect，没有scheduler，只有trigger
    // ✨调用trigger，其实就是调用effect.run，并调用getter(this._value)
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () =>
        triggerRefValue(
          this,
          this.effect._dirtyLevel === DirtyLevels.MaybeDirty_ComputedSideEffect
            ? DirtyLevels.MaybeDirty_ComputedSideEffect
            : DirtyLevels.MaybeDirty
        )
    )

    // ✨将自身挂载到effect上，dirty的边界处理需要
    this.effect.computed = this

    // ✨SSR模式，effect默认不活跃
    this.effect.active = this._cacheable = !isSSR
    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    // ✨兼容readonly(computed())等情况
    const self = toRaw(this)
    if (
      (!self._cacheable || self.effect.dirty) &&
      hasChanged(self._value, (self._value = self.effect.run()!))
    ) {
      // ✨缓存失效，重新计算，并触发依赖该computed的effect
      triggerRefValue(self, DirtyLevels.Dirty)
    }

    // ✨追踪该computed作为一个dep
    trackRefValue(self)

    // ✨边界情况处理
    if (self.effect._dirtyLevel >= DirtyLevels.MaybeDirty_ComputedSideEffect) {
      if (__DEV__ && (__TEST__ || this._warnRecursive)) {
        warn(COMPUTED_SIDE_EFFECT_WARN, `\n\ngetter: `, this.getter)
      }
      triggerRefValue(self, DirtyLevels.MaybeDirty_ComputedSideEffect)
    }
    return self._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }

  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty
  }

  set _dirty(v) {
    this.effect.dirty = v
  }
  // #endregion
}
```

在 `ComputedRefImpl` 类中，计算属性同时绑定了 `dep` 和 `effect` 两个属性，这是因为计算属性可以同时作为依赖和作用存在。

可以看到 `computed` 的主要逻辑在于 `get value` 中，首先是针对被其他响应式函数包装，做了一个兼容处理。然后是进行缓存是否失效的判断，其条件有 3 个：

- 不是 SSR 模式
- effect.dirty > 0
- getter 的返回值发生了变化

在这 3 点中，我们主要关注第 2 点，即什么时候 `effect.dirty > 0`。由于 `computed` 本身就是一个 `effect`，因此当 `getter` 中的**依赖**发生变化，就会触发这个计算属性作用，而在之前的文章中已经了解到，在 trigger 过程中，会改变 `dirty` 的值，因为数据发生了变化。同时还注意到在 `constructor` 中，创建的 `effect` 实例，传入的 `trigger` 参数中，设置的 `dirtyValue` 为 `DirtyLevels.MaybeDirty_ComputedSideEffect || DirtyLevels.MaybeDirty`，因此只要 `getter` 中的依赖发生了变化，就会重新计算 `computed` 的值，值得注意的是在后面的 `hasChange` 判断中，只要重新计算的新值与旧值符合 `Object.is`，那么缓存也不会失效。

接着是处理了一个边界问题，其中警告的内容如下：

```ts
export const COMPUTED_SIDE_EFFECT_WARN =
  `Computed is still dirty after getter evaluation,` +
  ` likely because a computed is mutating its own dependency in its getter.` +
  ` State mutations in computed getters should be avoided. ` +
  ` Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`
```

关于这个边界问题，官方文档中指出：

> 计算属性的 getter 应只做计算而没有任何其他的副作用，这一点非常重要，请务必牢记。举例来说，不要改变其他状态、在 getter 中做异步请求或者更改 DOM！

对于这个上述描述的情况，我还没有测试过，就不进行展开，作为开发者，遵循官方的设计哲学进行代码编写就好了。

## 结语

计算属性的整体逻辑比较简单，对于最后的边界问题，等有时间再进行补充吧。
