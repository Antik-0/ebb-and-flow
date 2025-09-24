<script setup lang='ts'>
import type { MenuItem } from '#/controller/navbar'
import { LayoutGroup } from 'motion-v'
import { ref } from 'vue'
import FlowingLight from '#/components/widgets/FlowingLight.vue'
import { useMenuHover } from '#/controller/navbar'
import MenubarGroup from './MenubarGroup.vue'

const menuList = ref<MenuItem[]>([
  { text: '首页', icon: 'lucide:circle-dot', href: '/' },
  { text: '文稿', icon: 'lucide:pencil-line', href: '/', children: [] },
  { text: '编程', icon: 'lucide:atom', href: '/', children: [] },
  { text: '特效', icon: 'lucide:sparkles', href: '/', children: [] },
  { text: '更多', icon: 'ic:twotone-signpost', href: '/', children: [] }
])

const activeIndex = ref(0)

const { scope, offsetX } = useMenuHover()
</script>

<template>
  <nav
    id="nav-menu"
    ref="scope"
    class="nav-menu"
  >
    <menu
      class="text-[14px] px-4 flex"
      role="menu"
      :transition="{ duration: 2 }"
    >
      <LayoutGroup>
        <MenubarGroup
          v-for="(item, index) in menuList"
          :key="index"
          :is-active="activeIndex === index"
          :item="item"
          @click="activeIndex = index"
        />
      </LayoutGroup>
    </menu>

    <div
      aria-hidden="true"
      class="nav-menu__bg"
      :style="{ '--offset-x': offsetX + 'px' }"
    ></div>

    <FlowingLight />
  </nav>
</template>

<style>
.nav-menu {
  --rounded: 999px;

  isolation: isolate;
  position: relative;
  border-radius: var(--rounded);
  box-shadow: 0 1px 10px 0 hsl(214 93% 73% / 0.4),
              inset 0 0 40px 2px hsl(187 92% 69% / 0.1);
}

.nav-menu:hover .nav-menu__bg {
  opacity: 1;
}

.nav-menu__bg {
  --bg-color: color-mix(in lch, var(--c-brand) 20%, transparent);

  contain: content;
  position: absolute;
  inset: 0;
  z-index: -2;
  opacity: 0;
  transition: opacity ease-in 200ms;
  border-radius: var(--rounded);
  background: radial-gradient(100px circle at var(--offset-x) 50%, var(--bg-color) 0%, transparent 65%)
}
</style>
