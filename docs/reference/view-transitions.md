# view-transitions - 视图过渡

今天介绍一个新的 Web API - `View Transition API`，该 API 是 2023 年新出的，用于实现平滑的过渡动画效果。

::: info 参考
[使用 View Transition API 实现平滑过渡](https://developer.chrome.com/docs/web-platform/view-transitions?hl=zh-cn)

[MDN - View Transitions API](https://developer.mozilla.org/zh-CN/docs/Web/API/View_Transitions_API)
:::

## 介绍

视图过渡的使用非常简单，只需要一个 `startViewTransition` 函数即可，其接收的参数 `callback` 为一个触发视图过渡动画的回调函数，通常是修改 DOM。这个函数返回了一些 `Promise` 对象，提供了在过渡到达不同状态时运行代码的功能（例如，准备运行动画，或动画完成），或跳过视图过渡。

```js
async function handleClick() {
  // 浏览器不支持的回退方案，没有过渡动画效果
  if (!document.startViewTransition) {
    updateTheDOMSomehow()
    return
  }

  // 启用视图过渡
  const transition = document.startViewTransition(() => updateTheDOMSomehow()) // [!code highlight]

  // 等待伪元素创建完成：
  await transition.read

  // 等待过渡动画结束
  await transition.finished
}
```

当通过 `startViewTransition` 来开启一个视图过渡的时候，浏览器会在 `html` 元素下创建一个伪元素树，如下所示：

```
::view-transition
└─ ::view-transition-group(root)
   └─ ::view-transition-image-pair(root)
      ├─ ::view-transition-old(root)
      └─ ::view-transition-new(root)
```

在调用 `updateTheDOMSomehow()` 前，系统会记录一次当前 `DOM` 树的状态快照，传给`::view-transition-old(root)`，在 `updateTheDOMSomehow()` 调用完成后，再次记录一次当前 `DOM` 树的状态快照，传给`::view-transition-new(root)`。我们可以简单的理解为：浏览器会在 `updateTheDOMSomehow()` 调用前后分别对当前页面进行一次截图，然后对这两张图片使用过渡动画。

上述伪元素数是一棵真实的 DOM 树，我们可以通过任何 CSS 来操作它，同时它是挂载到了 `html` 元素下，还可以通过给 `html` 不同的 `class` 来实现不同的动画效果。

更酷的是，这个快照并不是一张简单的图片，我们可以为某个元素设置 `view-transition-name`，来单独控制该元素的 CSS，比如：

```css
.title {
  view-transition-name: title;
}
```

将生成如下伪元素树：

```
::view-transition
├─ ::view-transition-group(root)
│  └─ ::view-transition-image-pair(root)
│     ├─ ::view-transition-old(root)
│     └─ ::view-transition-new(root)
└─ ::view-transition-group(title)
   └─ ::view-transition-image-pair(title)
      ├─ ::view-transition-old(title)
      └─ ::view-transition-new(title)
```

其中 `root` 表示的是整个页面的快照，而 `title` 则是 `.title` 这个元素的快照。

视图过渡有一个默认的淡入淡出动画效果，关于这个以及其他细节，这里就不介绍了，可以阅读[这篇文章](https://developer.chrome.com/docs/web-platform/view-transitions/same-document?hl=zh-cn#the_default_transition_cross-fade)了解更多。

下面通过一个实践来看看具体的使用。

## 实践

本站点主页的进入和退出的过渡动画就是使用了视图过渡，下面来看看如何实现的。

首先，我希望实现一个当从主页进入到详情页的时候，主页逐渐从顶部滑出，详情页逐渐从底部滑入，然后从详情页回到主页的时候，主页逐渐从顶部滑入，详情页逐渐从底部滑出这样的效果。

当确认了想要的效果后，我们知道需要获取的视图快照分别是进出前后的主页和详情页状态，那么何时触发回调才能获取想要的快照效果呢？一个很好的时机就是路由的切换！很幸运的是，`vitepress` 提供了一个简单的路由守卫功能。

::: code-group

```ts [Layout.vue]
const { viewTransitionStart, viewTransitionEnd } = useViewTransition()
const router = useRouter()

interface RouterGuard {
  onBeforeRouteChange: typeof router.onBeforePageLoad
  onAfterRouteChanged: typeof router.onAfterRouteChanged
}

const routerGuard: RouterGuard = {
  onBeforeRouteChange(to) {
    // 主页滑出
    if (to === withBase('/guide/reactive')) {
      viewTransitionStart(true)
    }

    // 主页滑入
    if (to === site.value.base) {
      viewTransitionStart(false)
    }
  },
  onAfterRouteChanged(to) {
    viewTransitionEnd()
  }
}

Object.assign(router, routerGuard)
```

```ts [useViewTransition.ts]
const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

export function useViewTransition() {
  let transitionResolve: ((value: unknown) => void) | null = null

  async function viewTransitionStart(out: boolean) {
    if (!enableTransitions()) return

    const transitionClass = out ? 'home-slide-out' : 'home-slide-in'
    const transitionPromise = new Promise(
      resolve => (transitionResolve = resolve)
    )

    const transition = (document as any).startViewTransition(async () => {
      document.documentElement.classList.add(transitionClass)
      await transitionPromise
    })

    await transition.finished
    document.documentElement.classList.remove(transitionClass)
    transitionResolve = null
  }

  function viewTransitionEnd() {
    transitionResolve && transitionResolve(true)
  }

  return { viewTransitionStart, viewTransitionEnd }
}
```

:::

我将路由守卫放在了 `Layout.vue` 组件上来监听路由的变化，当 `进入/退出` 主页的时候就开启视图过渡。

为了获取路由切换前的主页快照，需要在前置路由守卫中开启 `startViewTransition` 记录一次快照，而要获取详情页的快照，就必须等到路由切换后，也就是在后置路由守卫中来结束回调执行。

由于快照的获取涉及到了路由切换前后两个状态，因而这个回调函数一定是一个异步函数，所以我在切换路由前`(viewTransitionStart)`创建了一个 `Promise.resolve` 引用，等到路由切换后`(viewTransitionEnd)`调用这个指针 `resolve` 掉这个 `promise`，这样回调函数的执行过程才能跨度两个函数。

:::tip
请记住，快照的两次获取时间分别为回调调用开始和回调调用结束，快照的结果取决于回调函数执行前后的状态。
:::

当获取到快照了，只需要通过 CSS 实现想要的过渡效果即可。

```css
@keyframes slide-down {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

/* Home View Transitions */
::view-transition-group(root) {
  animation-duration: 1.6s;
  animation-timing-function: ease-in;
}

.home-slide-out::view-transition-old(root) {
  animation-name: slide-down;
  animation-direction: reverse;
}

.home-slide-out::view-transition-new(root) {
  animation-name: slide-up;
}

.home-slide-in::view-transition-old(root) {
  animation-name: slide-up;
  animation-direction: reverse;
}

.home-slide-in::view-transition-new(root) {
  animation-name: slide-down;
}
```

以上就是本站点主页的过渡视图实现，由于是整个页面参与过渡，因而动画的实现也十分简单。

特别的，由于该 API 是一个很新的特性，因此很多浏览器都还没有兼容。

::: danger BUG 说明
本站点的视图过渡在开发环境下是没有问题的，但是当部署到 `Giuhub Pages` 后，过渡动画出现了 BUG，只有首次能正确获取路由切换前后的快照，后续的切换都只能获取到路由切换后的快照，关于这个问题，目前还没有找到原因。。。
:::
