<script setup lang='ts'>
import { useData } from 'vitepress'
import { onMounted, shallowRef, watch } from 'vue'

const { page } = useData()

interface Anchor {
  text: string
  href: string
  level: number
  offset: number
}

const anchors = shallowRef<Anchor[]>([])

function computeOutline() {
  const content = document.getElementById('content')!
  const elements = content.querySelectorAll<HTMLElement>('h2,h3')

  const data: Anchor[] = []
  for (const element of elements) {
    data.push({
      text: element.textContent,
      href: `#${element.id}`,
      level: Number(element.tagName.at(-1)) - 2,
      offset: 0
    })
  }

  anchors.value = data
}

watch(page, computeOutline, { flush: 'post' })

onMounted(() => {
  computeOutline()
})

// let ob = new IntersectionObserver(entries => {}, { threshold: [1] })

function computeElementOffset(element: HTMLElement) {
  const root = document.documentElement
  let offsetTop = 0
  let currNode = element
  while (currNode && currNode !== root) {
    offsetTop += currNode.offsetTop
    currNode = currNode.offsetParent as HTMLElement
  }
  return offsetTop
}
</script>

<template>
  <aside class="aside-outline">
    <nav class="">
      <div class="text-sm text-[--c-text-1] leading-8 font-600">页面导航</div>
      <ul class="pl-4 border-l border-brand-3">
        <li
          v-for="(item, index) in anchors"
          :key="index"
          :style="{ '--level': item.level }"
        >
          <a class="outline-link" :href="item.href" :title="item.text">{{ item.text }}</a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.aside-outline {
  position: sticky;
  align-self: flex-start;
  top: var(--nav-height);
  width: 320px;
  padding: 24px;
  border-radius: 20px;
}

.outline-item {
  padding-left: calc(var(--level, 0) * 10px);
}

.outline-link {
  font-size: 14px;
  line-height: 32px;
  color: var(--c-text-2);
  transition: color 250ms ease;
}

.outline-link:hover {
  color: var(--c-brand-3);
}
</style>
