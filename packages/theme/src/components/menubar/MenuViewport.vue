<script setup lang='ts'>
import type { SetupContext, VNode } from 'vue'
import type { Content as ContentRecord } from '#/controller/navbar.ts'
import { AnimatePresence, motion } from 'motion-v'
import { computed, h, ref, watch } from 'vue'
import { useMenuViewCtx } from '#/controller/navbar.ts'

interface ContentProps {
  render?: () => VNode[]
}

function Content(props: ContentProps, { attrs }: SetupContext) {
  const { render, ...restProps } = props
  return h('div', { ...restProps, ...attrs }, render?.())
}
Content.props = ['render']

const { visible, contents, prevHoverIndex, currHoverIndex, arrowOffsetX } =
  useMenuViewCtx()

interface ContentItem extends ContentRecord {
  show: boolean
  motion?: 'from-start' | 'from-end' | 'to-start' | 'to-end'
}

const contentList = ref<ContentItem[]>(
  contents.value.map(content => ({
    show: false,
    motion: undefined,
    ...content
  }))
)

watch(currHoverIndex, index => {
  onHoverIndexChange(index, prevHoverIndex.value)
})

const showArrow = computed(
  () => contentList.value[currHoverIndex.value]?.item.items?.length
)

function onHoverIndexChange(currIndex: number, prevIndex: number) {
  const currItem = contentList.value[currIndex]!
  const prevItem = contentList.value[prevIndex]

  const isFromEnd = currIndex > prevIndex
  currItem.motion = isFromEnd ? 'from-end' : 'from-start'
  if (prevItem) {
    prevItem.motion = isFromEnd ? 'to-start' : 'to-end'
  }
  currItem.show = true
}

function onAnimationend(event: AnimationEvent) {
  const target = event.target as HTMLElement
  if (!target.classList.contains('menu-content')) {
    return
  }
  const motion = target.getAttribute('data-motion')!
  if (motion.startsWith('to')) {
    const index = Number(target.getAttribute('data-index'))
    contentList.value[index]!.show = false
  }
}
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="visible"
      :animate="{ y: 0 }"
      class="menu-viewport"
      :exit="{ opacity: 0, y: 40 }"
      :initial="{ y: 40 }"
      :transition="{
        type: 'spring',
        duration: 0.6
      }"
      @pointermove.stop="() => {}"
    >
      <div class="flex w-full justify-center">
        <div
          v-show="showArrow"
          class="menu-viewport__arrow"
          :style="{ translate: `${arrowOffsetX}px 50%` }"
        ></div>
      </div>
      <div
        class="mask-glass rounded-4 relative overflow-hidden"
        @animationend="onAnimationend"
      >
        <Content
          v-for="(item, index) in contentList"
          v-show="item.show"
          :key="index"
          class="menu-content"
          :data-active="currHoverIndex === index"
          :data-index="index"
          :data-motion="item.motion"
          :render="item.render"
        />
      </div>
    </motion.div>
  </AnimatePresence>
</template>
