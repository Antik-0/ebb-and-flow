<script setup lang='ts'>
import { LayoutGroup } from 'motion-v'
import { provide } from 'vue'
import FlowingLight from '#/components/FlowingLight.vue'
import { useSharedMenus } from '#/controller/menus.ts'
import {
  MenubarCtx,
  useMenuHover,
  useMenuViewControl
} from '#/controller/navbar'
import MenubarGroup from './MenubarGroup.vue'
import MenubarItem from './MenubarItem.vue'
import MenuViewport from './MenuViewport.vue'

const { menus } = useSharedMenus()

const { scope, offsetX } = useMenuHover()

const {
  contents,
  prevHoverIndex,
  currHoverIndex,
  forwarItemContent,
  onMenuItemHover
} = useMenuViewControl()

provide(MenubarCtx, {
  contents,
  prevHoverIndex,
  currHoverIndex,
  forwarItemContent,
  onMenuItemHover
})
</script>

<template>
  <nav
    id="nav-menu"
    ref="scope"
    class="nav-menu"
  >
    <menu
      class="text-sm px-4 flex"
      role="menu"
    >
      <LayoutGroup>
        <MenubarItem
          v-for="(item, index) in menus"
          :key="index"
          :index="index"
          :item="item"
        >
          <template #content>
            <MenubarGroup v-if="item.items" :items="item.items" />
          </template>
        </MenubarItem>
      </LayoutGroup>
    </menu>

    <MenuViewport />

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
  --bg-color: color-mix(in lch, var(--c-brand-1) 20%, transparent);

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
