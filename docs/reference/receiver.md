# Receiver 对象

`receiver` 这个对象存在于 `Proxy/Reflect` 对象中的 **_get_** 和 **_set_** 方法。

关于 `Proxy/Reflect` 的更多知识可以参考 [阮一峰老师的 ES6 教程](https://wangdoc.com/es6/proxy) 以及 [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)。

## Reflect

MDN 中关于 [Reflect.get](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get) 和 [Reflect.set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/set) 有如下描述：

> 如果 target 对象中指定了 getter，receiver 则为 getter 调用时的 this 值。
>
> 如果遇到 setter，receiver 则为 setter 调用时的 this 值。

上面的描述都提到了 `this`，通过一个例子即可说明。

```js
const foo = {
  id: 1,
  _n: 1,
  get n() {
    return this._n
  },
  set n(value) {
    this._n = value
  }
}

const bar = { _n: 2 }

console.log(Reflect.get(foo, 'n')) // 1
console.log(Reflect.get(foo, 'n', bar)) // 2
console.log(Reflect.get(foo, 'id', bar)) // 1

Reflect.set(foo, 'n', 100)
Reflect.set(foo, 'n', 200, bar)

console.log(foo.n) // 100
console.log(bar._n) // 200

const empty = {}
Reflect.set({}, 'n', 100, empty)
console.log(empty.n) // 100
```

在上面例子中，`foo.n` 具有 **_getter_** 和 **_setter_** ，因而当执行 `Reflect.get(foo, 'n', bar)` 和 `Reflect.set(foo, 'n', 200, bar)` 时，会将 **_getter_** 和 **_setter_** 中的 `this` 对象替换为 `receiver` 参数，也就是 `bar` 变量。

同时，对于 Reflect.set 操作，只要传入 `receiver` 对象，那么 set 操作的目标对象就是 `receiver`。

## Proxy

MDN 中关于 [handler.get](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get) 和 [handler.set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set) 有如下描述：

> Proxy 或者继承 Proxy 的对象。
>
> 最初接收赋值的对象。通常是 proxy 本身，但 handler 的 set 方法也有可能在原型链上，或以其他方式被间接地调用（因此不一定是 proxy 本身）。

上述描述有两点信息：

1. receiver 指代最初进行操作的对象。
2. proxy 操作如果存在对象的原型链上，也会触发。

```ts
let p3 = null

const o = {}
const p1 = new Proxy(o, {
  get(t, k, receiver) {
    console.log('proxy p1 >>>', receiver === p1)
    console.log('proxy p1 >>>', receiver === p3)
    return Reflect.get(t, k)
  }
})
const p2 = new Proxy(p1, {
  get(t, k, receiver) {
    console.log('proxy p2 >>>', receiver === p2)
    console.log('proxy p2 >>>', receiver === p3)
    return Reflect.get(t, k)
  }
})
p2.msg
// proxy p2 >>> true
// proxy p2 >>> false
// proxy p1 >>> true
// proxy p1 >>> false

p3 = Object.create(p2)
p3.msg
// proxy p2 >>> false
// proxy p2 >>> true
// proxy p1 >>> true
// proxy p1 >>> false
```

在上面例子中，存在嵌套代理，执行 `p2.msg` 的时候，可以看到 `p1.get` 和 `p2.get` 中 `reciver` 对象分别指向了各自的代理对象，这很好理解。而执行 `p3.msg` 的时候，`p2.get` 中的 `receiver` 指向了 `p3`，`p1.get` 中的 `receiver` 则指向了 `p1`。这是符合上面提出的描述：`Proxy 或者继承 Proxy 的对象`，下面进行解释：

首先 `p3` 是以代理对象 `p2` 为原型创建的，`p3` 本身没有 `msg` 属性，所以就到原型链上找，因而先是进入了 `p2` 的代理拦截(此时的 `get` 拦截是通过原型链触发的)，因此 `receiver` 指向了**当前进行操作**的对象，也就是 `p3`，接着在 `p2.get` 中 `return Reflect.get(t, k)`，继而触发了 `p1` 的代理拦截，为什么能触发 `p1` 的拦截？因为 `p2.get` 中的参数 `t` 指代的是 `p1`，所以 `p2.get` 中的返回值就等同于 `p1.msg`，因而在 `p1.get` 中 `当前进行操作的对象` 实际就是指代 `p1`，故而有：`p3.msg` 背后实际是 `p3.msg` 和 `p1.msg` 两次调用。

::: tip
注意到上面 `p2` 的 `return` 是 `Reflect.get(t, k)` 而不是 `Reflect.get(t, k, receiver)`，如果是后者显示传入了 `receiver` 对象，那么在 `p1` 中的 `receiver` 即为显示传入的对象。
:::

```js
const foo = new Proxy(
  {},
  {
    set(target, key, value, receiver) {
      console.log(receiver === foo)
      return Reflect.set(target, key, value)
    }
  }
)
const bar = Object.create(foo)

bar.x = 1
console.log(Object.hasOwn(foo, 'x')) // true
console.log(Object.hasOwn(bar, 'x')) // false
```

上面代码中，`bar` 不是一个 proxy 实例，但是执行 `bar.x = 1` 时，还是触发了 `foo` 的 set 拦截，这是因为设置 `bar.x` 属性的值时，`bar` 并没有 `x` 属性，因此引擎会到 `bar` 的原型链去找 `x` 属性。同时 `bar` 的原型链上有一个 proxy 对象 `foo`，从而触发了 `foo` 的 set 代理。

::: tip
如果本意是想将 `x = 1` 绑定到 `bar` 上，只需将 `receiver` 显示传入，即使用 `Reflect.set(target, key, value, receiver)` 即可。
:::

## 结语

在 Reflect 中，receiver 对象指代了 **_getter/setter_** 中的 **this** 对象。

在 Proxy 中， receiver 对象指代了 **最初被操作** 的对象。
