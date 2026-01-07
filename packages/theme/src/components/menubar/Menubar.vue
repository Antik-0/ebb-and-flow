<script setup lang='ts'>
import { LayoutGroup, animate, motion, useMotionValue } from 'motion-v'
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import FlowingLight from '#/components/FlowingLight.vue'
import { useSharedMenus } from '#/controller/menus.ts'
import {
  provideMenubarContent,
  useMenuViewControl
} from '#/controller/navbar.ts'
import { useResizeObserver } from '#/hooks'
import MenubarGroup from './MenubarGroup.vue'
import MenubarItem from './MenubarItem.vue'
import MenuViewport from './MenuViewport.vue'

// scope 的计算信息
let scopeHalfWidth = 0
let scopeOffsetLeft = 0
let menuItemNodes: HTMLElement[] = []

const scope = useTemplateRef('scope')
const { observe } = useResizeObserver()

onMounted(() => {
  observe(
    () => scope.value,
    entry => {
      const target = entry.target as HTMLElement
      const rect = target.getBoundingClientRect()
      scopeHalfWidth = rect.width / 2
      scopeOffsetLeft = rect.left
    }
  )

  menuItemNodes = [
    ...scope.value!.querySelectorAll<HTMLElement>("li[role='menuitem']")
  ]
})

// 距离 scope 左边界的偏移量
const hoverX = ref(0)
const onMousemove = (event: MouseEvent) => {
  hoverX.value = event.clientX - scopeOffsetLeft
}

// 距离 scope 中心点的偏移量
const offsetX = ref(0)
const motionX = useMotionValue(0)
const motionW = useMotionValue(0)

const activeIndex = ref(-1)
const { menus, currActiveNode } = useSharedMenus()

const {
  visible,
  prevHoverIndex,
  currHoverIndex,
  contentViews,
  onMouseenter,
  onMouseleave,
  onMenuItemHover,
  forwarContent
} = useMenuViewControl()

onMounted(() => {
  watch(
    () => currHoverIndex.value,
    index => updateMotion(index)
  )

  // 初始化
  activeIndex.value = menus.value.findIndex(item => item.active)
  watch(
    () => currActiveNode.value,
    async () => {
      const prevActiveIndex = activeIndex.value
      const index = menus.value.findIndex(item => item.active)
      activeIndex.value = index

      if (prevActiveIndex !== index) {
        // 等一帧，图标未渲染完成
        await nextTick()

        if (index === currHoverIndex.value) {
          updateMotion(index)
        } else {
          currHoverIndex.value = index
        }
      }
    }
  )
})

function updateMotion(index: number) {
  const target = menuItemNodes[index]!
  const itemWidth = target.offsetWidth
  offsetX.value = target.offsetLeft + itemWidth / 2 - scopeHalfWidth

  animate(motionX, offsetX.value, { type: 'spring', duration: 0.6 })
  animate(motionW, itemWidth, { type: 'spring', duration: 0.6 })
}

function onViewportClose() {
  currHoverIndex.value = activeIndex.value
}

provideMenubarContent({
  offsetX,
  showViewport: visible,
  contentViews,
  prevHoverIndex,
  currHoverIndex,
  forwarContent
})
</script>

<template>
  <nav
    ref="scope"
    class="menubar"
    @pointerenter="onMouseenter"
    @pointerleave="onMouseleave"
    @pointermove="onMousemove"
  >
    <div
      aria-hidden="true"
      class="menubar-background"
      :style="{ '--offset-x': hoverX + 'px' }"
    ></div>

    <motion.div
      class="menubar-indicator absolute -z-1"
      data-show="true"
      :style="{ x: motionX, width: motionW }"
    />

    <menu
      class="grid-full px-4 flex"
      role="menu"
    >
      <LayoutGroup>
        <MenubarItem
          v-for="(item, index) in menus"
          :key="index"
          :item="item"
          @hover="onMenuItemHover(index)"
        >
          <template #content>
            <MenubarGroup v-if="item.items" :items="item.items" />
          </template>
        </MenubarItem>
      </LayoutGroup>
    </menu>

    <FlowingLight />
    <MenuViewport @close="onViewportClose" />
  </nav>
</template>
