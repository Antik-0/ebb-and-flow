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
  <div class="flex flex-col gap-5 items-center">
    <div class="flex gap-5">
      <button
        class="text-black px-4 py-2 rounded-lg bg-[aliceblue]"
        type="button"
        @click="mount"
      >
        手动挂载
      </button>
      <button
        class="text-black px-4 py-2 rounded-lg bg-[aliceblue]"
        type="button"
        @click="unmount"
      >
        手动卸载
      </button>
    </div>

    <div>组件视图</div>
    <div id="render-vnode-view"></div>
  </div>
</template>
