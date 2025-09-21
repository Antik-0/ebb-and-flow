<script setup lang='ts'>
import type { MenuItem } from '#/controller/navMenu.ts'
import { ref } from 'vue'
import { useNavMouseHoverState } from '#/controller/navMenu.ts'
import EAFNavMenuItem from './EAFNavMenuItem.vue'
import FlowingLight from './widgets/FlowingLight.vue'

const menuList = ref<MenuItem[]>([
  { text: '首页' },
  { text: '编程' },
  { text: '手记' },
  { text: '时光' },
  { text: '更多' }
])

const activeIndex = ref(0)

const { scope } = useNavMouseHoverState()
</script>

<template>
  <nav
    id="navbar"
    ref="scope"
    class="navbar rounded-full relative isolate"
  >
    <FlowingLight />

    <menu class="text-[14px] px-4 flex" role="menu">
      <EAFNavMenuItem
        v-for="(item, index) in menuList"
        :key="index"
        :is-active="activeIndex === index"
        :item="item"
        @click="activeIndex = index"
      />
    </menu>
  </nav>
</template>

<style>
.navbar {
  box-shadow: 0 1px 10px 0 hsl(214 93% 73% / 0.4),
              inset 0 0 40px 2px hsl(187 92% 69% / 0.1);
}
</style>
