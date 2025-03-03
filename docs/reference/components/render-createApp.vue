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

<template>
  <div class="render-demo">
    <div style="display: flex; gap: 20px">
      <button type="button" @click="mount">手动挂载</button>
      <button type="button" @click="unmount">手动卸载</button>
    </div>

    <div>组件视图</div>
    <div id="render-app-view"></div>
  </div>
</template>

<style scoped>
.render-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.render-demo button {
  padding: 0.5em 1em;
  border-radius: 8px;
  color: #000;
  background-color: aliceblue;
}
</style>
