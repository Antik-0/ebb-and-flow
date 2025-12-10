<script setup lang='ts'>
import { LayoutGroup } from 'motion-v'
import { useTemplateRef } from 'vue'
import FlowingLight from '#/components/FlowingLight.vue'
import { useSharedMenus } from '#/controller/menus.ts'
import { useMenuViewControl, useMenubarHover } from '#/controller/navbar'
import MenubarGroup from './MenubarGroup.vue'
import MenubarItem from './MenubarItem.vue'
import MenuViewport from './MenuViewport.vue'

const { menus } = useSharedMenus()

const scope = useTemplateRef('scope')

const { offsetX, onMousemove } = useMenubarHover(scope)

const { onMouseenter, onMouseleave } = useMenuViewControl(scope)
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
      :style="{ '--offset-x': offsetX + 'px' }"
    ></div>

    <div class="menubar-indicator grid-full -z-1"></div>

    <menu
      class="grid-full px-4 flex"
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

    <FlowingLight />
    <MenuViewport />
  </nav>
</template>
