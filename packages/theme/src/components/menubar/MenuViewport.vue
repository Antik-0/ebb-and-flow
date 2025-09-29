<script setup lang='ts'>
import type { SetupContext, VNode } from 'vue'
import type { Content as ContentRecord } from '#/controller/navbar.ts'
import { h, inject, ref, watch } from 'vue'
import { MenubarCtx } from '#/controller/navbar.ts'

interface ContentProps {
  render?: () => VNode[]
}

function Content(props: ContentProps, { attrs }: SetupContext) {
  const { render, ...restProps } = props
  return h('div', { ...restProps, ...attrs }, render?.())
}
Content.props = ['render']

const { contents, prevHoverIndex, currHoverIndex } = inject(MenubarCtx)!

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
  <div class="menu-viewport">
    <div class="menu-viewport__arrow">
      <div class="arrow"></div>
    </div>
    <div class="menu-viewport__overlay" @animationend="onAnimationend">
      <Content
        v-for="(item, index) in contentList"
        v-show="item.show"
        :key="index"
        class="menu-content"
        :data-active="currHoverIndex === index"
        :data-index="index"
        :data-motion="item.motion"
        :render="item.render"
        adius
      />
    </div>
  </div>
</template>

<style>
.menu-viewport {
  contain: layout;
  isolation: isolate;
  position: absolute;
  top: 100%;
  left: 50%;
  translate: -50% 0;
  padding-top: 10px;
  min-width: 100%;
}

.menu-viewport__arrow {
  width: 100%;
  display: flex;
  justify-content: center;
}

.arrow {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  color: var(--c-brand-1);
  background: linear-gradient(45deg, transparent 50%, currentColor 50%);
  rotate: -45deg;
  translate: 0 50%;
  transition: translate 250ms ease;
}

.menu-viewport__overlay {
  position: relative;
  border-radius: 16px;
  background-color: var(--overlay-bg-color);
  backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: 0 2px 10px 1px hsl(0 0% 67% / 0.1),
              inset 0 0 10px 4px hsl(0 0% 80% / 0.1),
              inset 0 0 50px 4px hsl(0 0% 60% / 0.1),
              inset -1px -1px 4px hsl(0 0% 100% / 0.1)
}

.menu-content {
  position: absolute;
  inset: 0;
  z-index: -1;
  animation-duration: 600ms;
  animation-timing-function: ease;
}

.menu-content[data-active='true'] {
  position: relative;
  z-index: 20;
}

.menu-content[data-motion='from-start'] {
  animation-name: enter-from-start;
}
.menu-content[data-motion='from-end'] {
  animation-name: enter-from-end;
}
.menu-content[data-motion='to-start'] {
  animation-name: exit-to-start;
}
.menu-content[data-motion='to-end'] {
  animation-name: exit-to-end;
}


@keyframes enter-from-start {
	from {
		opacity: 0.6;
		transform: translateX(-200px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}


@keyframes enter-from-end {
	from {
		opacity: 0.6;
		transform: translateX(200px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}


@keyframes exit-to-start {
	from {
		opacity: 0.4;
		transform: translateX(0);
	}
	to {
		opacity: 0;
		transform: translateX(-200px);
	}
}

@keyframes exit-to-end {
	from {
		opacity: 0.4;
		transform: translateX(0);
	}
	to {
		opacity: 0;
		transform: translateX(200px);
	}
}

</style>
