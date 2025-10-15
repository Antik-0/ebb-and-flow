<script setup lang='ts'>
import { shallowRef, watch } from 'vue'
import { useOutline } from '#/controller/outline.ts'

const { anchors, activeIndex } = useOutline()

const marketOffset = shallowRef(0)

watch(
  activeIndex,
  index => {
    marketOffset.value = (index + 1) * 32
  },
  { flush: 'post' }
)
</script>

<template>
  <nav aria-label="outline" class="pl-4 border-l-2 border-divider relative isolate">
    <div
      v-show="activeIndex !== -1"
      class="bg-brand-3/20 h-8 transition-transform duration-200 inset-x-0 absolute -ml-[2px] -z-1"
      :style="{ translate: `0 ${marketOffset}px` }"
    ></div>
    <div class="text-14px text-[--c-text-1] leading-8 font-600">页面导航</div>
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
