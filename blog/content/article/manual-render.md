# 手动渲染组件

<script setup lang="ts">
import type { App, Component, FunctionalComponent } from 'vue'
import { createApp, createVNode, render, h } from 'vue'

const Message: FunctionalComponent<{msg: string}> = props => {
  const message = `组件接收消息：${props.msg}`
  return h('div', message)
}

interface Options {
  appendTo: string
  props: {
    [prop: string]: unknown
  }
}

function createRenderByApp(component: Component, options: Options) {
  const { appendTo, props } = options
  let app: App<Element> | null = null

  const mount = () => {
    if (app !== null) return

    const target = document.getElementById(appendTo)!
    const container = document.createElement('div')

    app = createApp(component, props)
    app.mount(container)
    target.append(container.firstElementChild!)
  }

  const unmount = () => {
    app!.unmount()
    app = null
  }

  return [mount, unmount]
}

function createRenderByVNode(component: Component, options: Options) {
  const { appendTo, props } = options

  let container: HTMLElement | null = null
  let mounted = false

  const mount = () => {
    if (mounted) return

    if (!container) {
      container = document.createElement('div')
    }

    const VNode = createVNode(component, props)
    render(VNode, container)

    const target = document.getElementById(appendTo)!
    target.append(container.firstElementChild!)
    mounted = true
  }

  const unmount = () => {
    container && render(null, container)
    mounted = false
  }

  return [mount, unmount]
}

const [mountByApp, unmountByApp] = createRenderByApp(Message, {
  appendTo: 'render-app-view',
  props: {
    msg: 'hello,world'
  }
})

const [mountByVnode, unmountByVnode] = createRenderByVNode(Message, {
  appendTo: 'render-vnode-view',
  props: {
    msg: 'hello,world'
  }
})
</script>

## createApp

<div class="p-5">
  <div class="flex flex-col gap-5 items-center">
    <div class="flex gap-5">
      <button
        class="text-black px-4 py-2 rounded-lg bg-white"
        type="button"
        @click="mountByApp"
      >
        手动挂载
      </button>
      <button
        class="text-black px-4 py-2 rounded-lg bg-white"
        type="button"
        @click="unmountByApp"
      >
        手动卸载
      </button>
    </div>
    <div>组件视图</div>
    <div id="render-app-view"></div>
  </div>
</div>

```vue{28-33,37}
<script setup lang="ts">
import type { Component, FunctionalComponent, App } from 'vue'
import { createApp, h } from 'vue'

interface Props {
  msg: string
}

const ShowMessage: FunctionalComponent<Props> = props => {
  const message = `组件接收消息：${props.msg}`
  return h('div', message)
}

interface Options {
  appendTo: string
  props: Props & {
    [prop: string]: unknown
  }
}

function createRender(component: Component, options: Options) {
  const { appendTo, props } = options
  let app: App<Element> | null = null

  const mount = () => {
    if (app !== null) return

    const target = document.getElementById(appendTo)!
    const container = document.createElement('div')

    app = createApp(component, props)
    app.mount(container)
    target.append(container.firstElementChild!)
  }

  const unmount = () => {
    app!.unmount()
    app = null
  }

  return {
    mount,
    unmount
  }
}

const { mount, unmount } = createRender(ShowMessage, {
  appendTo: 'render-app-view',
  props: {
    msg: 'hello,world'
  }
})
</script>
```

## createVNode

<div class="p-5">
  <div class="flex flex-col gap-5 items-center">
    <div class="flex gap-5">
      <button
        class="text-black px-4 py-2 rounded-lg bg-white"
        type="button"
        @click="mountByVnode"
      >
        手动挂载
      </button>
      <button
        class="text-black px-4 py-2 rounded-lg bg-white"
        type="button"
        @click="unmountByVnode"
      >
        手动卸载
      </button>
    </div>
    <div>组件视图</div>
    <div id="render-vnode-view"></div>
  </div>
</div>

```vue{30-34,39}
<script setup lang="ts">
import type { Component, FunctionalComponent } from 'vue'
import { createVNode, render, h } from 'vue'

interface Props {
  msg: string
}

const ShowMessage: FunctionalComponent<Props> = props => {
  const message = `组件接收消息：${props.msg}`
  return h('div', message)
}

interface Options {
  appendTo: string
  props: Props & {
    [prop: string]: unknown
  }
}

function createRender(component: Component, options: Options) {
  const { appendTo, props } = options

  const container = document.createElement('div')
  let mounted = false

  const mount = () => {
    if (mounted) return

    const VNode = createVNode(component, props)
    render(VNode, container)

    const target = document.getElementById(appendTo)!
    target.append(container.firstElementChild!)
    mounted = true
  }

  const unmount = () => {
    render(null, container)
    mounted = false
  }

  return { mount, unmount }
}

const { mount, unmount } = createRender(ShowMessage, {
  appendTo: 'render-vnode-view',
  props: {
    msg: 'hello,world'
  }
})
</script>
```
