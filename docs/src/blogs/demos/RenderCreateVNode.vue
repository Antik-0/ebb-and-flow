<script setup lang="ts">
import type { Component, FunctionalComponent } from 'vue'
import { createVNode, h, render } from 'vue'

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

<template>
  <div class="render-demo">
    <div style="display: flex; gap: 20px">
      <button type="button" @click="mount">手动挂载</button>
      <button type="button" @click="unmount">手动卸载</button>
    </div>

    <div>组件视图</div>
    <div id="render-vnode-view"></div>
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
