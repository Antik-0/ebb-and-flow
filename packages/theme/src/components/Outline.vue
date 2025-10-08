<script setup lang='ts'>
import { useData } from 'vitepress'
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

interface Anchor {
  text: string
  to: string
  level: number
  offsetTop: number
}

let observer: IntersectionObserver

const anchors = shallowRef<Anchor[]>([])
const activeIndex = shallowRef(-1)
const marketOffset = shallowRef(0)

watch(
  activeIndex,
  index => {
    marketOffset.value = (index + 1) * 32 + 6
  },
  { flush: 'post' }
)

function createOutlineAnchors() {
  const content = document.getElementById('content')
  if (!content) return

  observer.disconnect()
  const elements = content.querySelectorAll<HTMLElement>('h2,h3')

  const data: Anchor[] = []
  for (const element of elements) {
    const offsetTop = calcOffsetTop(element)
    data.push({
      text: element.id,
      to: `#${element.id}`,
      level: Number(element.tagName.at(-1)) - 2,
      offsetTop
    })

    observer.observe(element)
  }
  const bottomSentry = document.getElementById('bottom-sentry')
  observer.observe(bottomSentry!)

  anchors.value = data
}

function calcOffsetTop(node: HTMLElement) {
  let offsetTop = 0
  while (node) {
    offsetTop += node.offsetTop
    node = node.offsetParent as HTMLElement
  }
  return offsetTop
}

const { page } = useData()

watch(page, createOutlineAnchors, { flush: 'post' })

onMounted(() => {
  createObserver()
  createOutlineAnchors()
})

onBeforeUnmount(() => {
  observer.disconnect()
  observer = null as any
})

function createObserver() {
  observer = new IntersectionObserver(computeActivedAnchor, {
    rootMargin: '-200px 0px 0px 0px'
  })
}

function computeActivedAnchor(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) {
    if (entry.target.id === 'bottom-sentry' && entry.isIntersecting) {
      activeIndex.value = anchors.value.length - 1
      return
    }
  }

  const scrollTop = document.documentElement.scrollTop

  let activated = -1
  for (const [index, anchor] of anchors.value.entries()) {
    if (anchor.offsetTop - scrollTop <= 200) {
      activated = index
    } else {
      break
    }
  }

  activeIndex.value = activated
}
</script>

<template>
  <nav aria-label="outline" class="pl-4 border-l border-l-2 border-divider relative">
    <div
      v-show="activeIndex !== -1"
      class="outline-marker"
      :style="{ translate: `0 ${marketOffset}px` }"
    ></div>
    <div class="text-sm text-[--c-text-1] leading-8 font-600">页面导航</div>
    <ul>
      <li
        v-for="(anchor, index) in anchors"
        :key="index"
        class="outline-item"
        :class="{ 'is-active': index === activeIndex }"
        :style="{ '--level': anchor.level }"
      >
        <a class="block truncate" :href="anchor.to" :title="anchor.text">
          {{ anchor.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
