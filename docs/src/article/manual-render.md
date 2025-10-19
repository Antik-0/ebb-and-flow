# 手动渲染组件

<script setup>
import RenderCreateAppDemo from '../components/RenderCreateApp.vue'
import RenderCreateVNodeDemo from '../components/RenderCreateVNode.vue'
</script>

## createApp

<div class="p-5">
  <RenderCreateAppDemo />
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
  <RenderCreateVNodeDemo />
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

  return {
    mount,
    unmount
  }
}

const { mount, unmount } = createRender(ShowMessage, {
  appendTo: 'render-vnode-view',
  props: {
    msg: 'hello,world'
  }
})
</script>
```
