import type {
  FunctionalComponent,
  InjectionKey,
  Ref,
  ShallowRef,
  VNode
} from 'vue'
import type { MenuItem } from '#/types'
import { h, inject, provide, ref, shallowRef } from 'vue'

export interface ContentView {
  item: MenuItem
  render: () => VNode[]
}

export function useMenuViewControl() {
  const visible = ref(false)
  const prevHoverIndex = ref(-1)
  const currHoverIndex = ref(-1)

  function onMouseenter() {
    visible.value = true
  }

  function onMouseleave() {
    visible.value = false
  }

  function onMenuItemHover(index: number) {
    prevHoverIndex.value = currHoverIndex.value
    currHoverIndex.value = index
  }

  const contentViews = shallowRef<ContentView[]>([])

  function forwardContent(item: MenuItem, render: () => VNode[]) {
    contentViews.value.push({ item, render })
  }

  return {
    visible,
    prevHoverIndex,
    currHoverIndex,
    contentViews,
    onMouseenter,
    onMouseleave,
    onMenuItemHover,
    forwardContent
  }
}

export const ContentRender: FunctionalComponent<{
  render: () => VNode[]
}> = (props, { attrs }) => h('div', { ...attrs }, props.render())
ContentRender.props = ['render']

interface MenubarContext {
  offsetX: Ref<number>
  showViewport: Ref<boolean>
  contentViews: ShallowRef<ContentView[]>
  prevHoverIndex: Ref<number>
  currHoverIndex: Ref<number>
  forwardContent: (item: MenuItem, render: () => VNode[]) => void
}

const MenubarCtx = Symbol('menubar') as InjectionKey<MenubarContext>

export function provideMenubarContent(value: MenubarContext) {
  provide(MenubarCtx, value)
}

export function useMenubarCtx() {
  return inject(MenubarCtx)!
}
