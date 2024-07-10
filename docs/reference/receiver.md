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

在上面例子中，`foo.n` 具有 **_getter_** 和 **_setter_** ，因而当执行 `Reflect.get(foo, 'n', bar)` 和 `Reflect.set(foo, 'n', 200, bar)` 时，会将 **_getter_** 和 **_setter_** 中的 `this` 对象替换为 `receiver` 参数，也就是 `bar` 变量。这就导致了操作的对象不再是 `foo` ，而变成了 `bar`，而 `foo.id` 不是一个 **_getter/setter_**，内部不存在 `this` 调用，因此是否传入 `receiver` 参数也就无关紧要了。

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
const o = {}
const b = new Proxy(o, {
  get(t, k, receiver) {
    console.log('proxy b >>>', receiver)
    return Reflect.get(t, k)
  }
})
const c = new Proxy(b, {
  get(t, k, receiver) {
    console.log('proxy c >>>', receiver)
    return Reflect.get(t, k)
  }
})
c.msg = 'receiver is me'
c.msg // 触发 get
// proxy c >>> Proxy(Object) {msg: 'receiver is me'}
// proxy b >>> Proxy(Object) {msg: 'receiver is me'}
```

在上面例子中，存在嵌套代理，同时 `c.get` 和 `b.get` 中 `reciver` 对象都是指向了 `c` 实例，这就说明了 `receiver` 指向了最初进行操作的对象。

```js
const handler = {
  set(target, key, value, receiver) {
    console.log(target === receiver)
    return Reflect.set(target, key, value, receiver)
  }
}
const foo = new Proxy({}, handler)
const bar = Object.create(foo)

bar.id = 1
console.log(Object.hasOwn(foo, 'id')) // false
console.log(Object.hasOwn(bar, 'id')) // true
```

上面代码中，`bar` 不是一个 proxy 实例，但是执行 `bar.id = 1` 时，还是触发了 `foo` 的 set 拦截，这是因为设置 `bar.id` 属性的值时，`bar` 并没有 `id` 属性，因此引擎会到 `bar` 的原型链去找 `id` 属性。同时 `bar` 的原型链上有一个 proxy 对象 `foo`，从而触发了 `foo` 的 get 代理。这时，第四个参数 `receiver` 就指向原始赋值行为所在的对象 `bar`，最后导致 `id` 属性赋值到了 `bar` 身上，而不是 `foo`。

## 结语

在 Reflect 中，receiver 对象指代了 **_getter/setter_** 中的 **this** 对象。

在 Proxy 中， receiver 对象指代了 **最初被操作** 的对象。
