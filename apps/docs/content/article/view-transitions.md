---
tags: ['视图过渡', '杂谈', '动画']
---

# view-transitions - 视图过渡

::page-meta
::

今天介绍一个新的 Web API - `View Transition API`，该 API 是 2023 年新出的，用于实现平滑的过渡动画效果。

::custom-block{title='参考'}
[使用 View Transition API 实现平滑过渡](https://developer.chrome.com/docs/web-platform/view-transitions?hl=zh-cn)

[MDN - View Transitions API](https://developer.mozilla.org/zh-CN/docs/Web/API/View_Transitions_API)
::

## 介绍

开启视图过渡非常简单，只需要调用 `startViewTransition` 函数即可，其接收的参数 `callback` 为一个触发视图过渡动画的回调函数，通常是修改 DOM。其返回一个包含多个 `Promise` 方法的对象，提供了在过渡到达不同状态时运行代码的功能（例如，准备运行动画，或动画完成），或跳过视图过渡。

```ts
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

上述构造的伪元素树是一棵真实的 `DOM` 树，我们可以通过任何 `CSS` 来操作它，同时它是挂载到了 `html` 元素下，因此还可以通过给 `html` 不同的 `class` 来实现不同的动画效果。

更酷的是，这个快照并不是一张简单的图片，我们可以为某个元素设置 `view-transition-name`，来单独控制该元素的 `CSS`，比如：

```css
.title {
  view-transition-name: title;
}
```

视图过渡有一个默认的淡入淡出动画效果，关于这个以及其他细节，这里就不介绍了，可以阅读[这篇文章](https://developer.chrome.com/docs/web-platform/view-transitions/same-document?hl=zh-cn#the_default_transition_cross-fade)了解更多。

下面通过一个实践来看看具体的使用。

## 实践

本站点主页的进入和退出的过渡动画就是使用了视图过渡，下面来看看如何实现的。

首先，我希望实现的效果是：

> 当主页进入的时候(详情页 -> 主页为进入过程)，主页(新快照)逐渐从顶部向下滑入屏幕，详情页(旧快照)逐渐从屏幕向下滑入底部
>
> 当主页退出的时候(主页 -> 详情页为退出过程)，详情页(新快照)逐渐从底部向上滑入屏幕，主页(旧快照)逐渐从屏幕向上滑入顶部

根据上述的描述，在视图过渡中页面的新旧状态分别为主页和详情页，也就是路由切换前后的页面状态，幸运的是，`vitepress` 提供了一个简单的路由守卫功能。

::code-group

```ts [Layout.vue]
const { viewTransitionStart, sleep } = useViewTransition()
const router = useRouter()

interface RouterGuard {
  onBeforeRouteChange: typeof router.onBeforeRouteChange
}

// 设置路由前置守卫
Object.assign(router, {
  async onBeforeRouteChange(to) {
    // 主页滑出
    const base = site.value.base
    const isBase = route.path === base
    if (isBase && to === withBase('/guide/reactive')) {
      viewTransitionStart(true)
      // 为了保证能正确获取当前路由的快照，延迟一点时间再进行路由跳转
      return await sleep(100)
    }

    // 主页滑入
    if (to === base) {
      viewTransitionStart(false)
      return await sleep(100)
    }
  }
} as RouterGuard)
```

```ts [useViewTransition.ts]
const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

export function useViewTransition() {
  async function viewTransitionStart(out: boolean) {
    if (!enableTransitions()) return

    const transitionClass = out ? 'home-slide-out' : 'home-slide-in'
    const transition = (document as any).startViewTransition(() => {
      document.documentElement.classList.add(transitionClass)
    })

    await transition.finished
    document.documentElement.classList.remove(transitionClass)
  }

  function sleep(time: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), time))
  }

  return { viewTransitionStart, sleep }
}
```

::

我将路由守卫放在了 `Layout.vue` 组件上来监听路由的变化，只有当主页 `进入/退出` 的时候才开启视图过渡。

需要注意的一点是，在 `onBeforeRouteChange` 这个钩子中，当开启视图过渡后，也就是调用 `viewTransitionStart` 函数后，需要通过 `sleep` 睡眠函数来延迟一下这个函数的返回时间。

理由是：`onBeforeRouteChange` 结束后，页面马上就跳转了，如果不设置一点延迟，在部署到生产环境后会出现无法正确获取当前页面(路由切换前)状态的 BUG，导致生成的新旧快照都是路由切换后的页面状态。

当获取到快照后，只需要通过 `CSS` 实现想要的过渡效果即可。

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
  --transition-duration: 1.6s;
}

.home-slide-out::view-transition-old(root) {
  animation: slide-down var(--transition-duration) ease reverse;
}

.home-slide-out::view-transition-new(root) {
  animation: slide-up var(--transition-duration) ease;
}

.home-slide-in::view-transition-old(root) {
  animation: slide-up var(--transition-duration) ease reverse;
}

.home-slide-in::view-transition-new(root) {
  animation: slide-down var(--transition-duration) ease;
}
```

以上就是本站点主页的过渡视图实现，由于是整个页面参与过渡，因而动画的实现也十分简单。

## 兼容性

由于该 API 是一个很新的特性，目前只有 `Chrome` 和 `Edge` 可以使用这个 API。
