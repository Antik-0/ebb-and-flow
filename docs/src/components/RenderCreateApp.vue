<script setup lang="ts">
import type { App, Component, FunctionalComponent } from 'vue'
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
    <div id="render-app-view"></div>
  </div>
</template>
