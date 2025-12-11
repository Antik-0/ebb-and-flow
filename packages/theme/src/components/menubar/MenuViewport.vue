<script setup lang='ts'>
import type { ContentView } from '#/controller/navbar.ts'
import { AnimatePresence, motion } from 'motion-v'
import { computed, ref, watch } from 'vue'
import GlassMask from '#/components/GlassMask.vue'
import { ContentRender, useMenubarCtx } from '#/controller/navbar.ts'

const emit = defineEmits<{
  close: []
}>()

const { offsetX, showViewport, contentViews, prevHoverIndex, currHoverIndex } =
  useMenubarCtx()

interface ContentItem extends ContentView {
  show: boolean
  motion?: 'from-start' | 'from-end' | 'to-start' | 'to-end'
}

const contents = ref<ContentItem[]>(
  contentViews.value.map(content => ({
    show: false,
    motion: undefined,
    ...content
  }))
)

watch(currHoverIndex, index => {
  onHoverIndexChange(index, prevHoverIndex.value)
})

const showArrow = computed(
  () => contents.value[currHoverIndex.value]?.item.items?.length
)

function onHoverIndexChange(currIndex: number, prevIndex: number) {
  const currItem = contents.value[currIndex]!
  const prevItem = contents.value[prevIndex]

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
    contents.value[index]!.show = false
  }
}

function onExitComplete() {
  !showViewport.value && emit('close')
}
</script>

<template>
  <AnimatePresence @exit-complete="onExitComplete">
    <motion.div
      v-if="showViewport"
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
          :style="{ translate: `${offsetX}px 50%` }"
        ></div>
      </div>
      <div class="relative isolate">
        <div
          class="rounded-4 relative overflow-hidden"
          @animationend="onAnimationend"
        >
          <ContentRender
            v-for="(item, index) in contents"
            v-show="item.show"
            :key="index"
            class="menu-content"
            :data-active="currHoverIndex === index"
            :data-index="index"
            :data-motion="item.motion"
            :render="item.render"
          />
        </div>
        <GlassMask class="rounded-4 inset-0 absolute -z-1" />
      </div>
    </motion.div>
  </AnimatePresence>
</template>
