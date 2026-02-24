import type { ComponentInstance } from 'vue'
import { LayoutGroup, animate, motion, useMotionValue } from 'motion-v'
import { defineComponent, ref, shallowRef, watch } from 'vue'
import { useCurrActiveNode, useMenus } from '#/controller/menus'
import {
  MenubarProvider,
  MotionProvider,
  useMenubarMotion,
  useMotion
} from '#/controller/navbar'
import FlowingLight from '../FlowingLight.vue'
import MenubarItem from './MenubarItem.vue'
import { MenuViewport } from './MenuViewport'

type HoverChangeCallback = (index: number) => void

export const Menubar = defineComponent(() => {
  const menus = useMenus()
  const currActiveNode = useCurrActiveNode()
  const { scope, updateMotion, onMotionChange } = useMenubarMotion()

  const viewportRef = shallowRef<ComponentInstance<typeof MenuViewport>>(null!)
  const hoverChangeCbs: HoverChangeCallback[] = []
  let activeIndex = -1

  watch(
    () => currActiveNode.value,
    () => {
      const prevActiveIndex = activeIndex
      let activeNode = currActiveNode.value
      while (activeNode?.parent) {
        activeNode = activeNode.parent
      }

      const index = menus.value.indexOf(activeNode!)
      if (prevActiveIndex !== index) {
        activeIndex = index
        updateMotion(index)
      }
    },
    { immediate: true }
  )

  function onMenuItemHover(index: number) {
    updateMotion(index)
    for (const cb of hoverChangeCbs) {
      cb(index)
    }
  }

  function onHoverIndexChange(callback: HoverChangeCallback) {
    hoverChangeCbs.push(callback)
  }

  function onMouseEnter() {
    viewportRef.value?.open()
  }

  function onMouseLeave() {
    viewportRef.value?.close()
  }

  function onViewportClose() {
    updateMotion(activeIndex)
  }

  const motionValue = { onMotionChange }
  const contextValue = { onMenuItemHover, onHoverIndexChange }

  return () => (
    <nav class="menubar" onPointerleave={onMouseLeave} ref={scope}>
      <MotionProvider value={motionValue}>
        <MenubarBackground />
        <MenubarIndicator />
      </MotionProvider>

      <MenubarProvider value={contextValue}>
        <menu
          class="grid-full px-4 flex"
          data-role="menu"
          onPointerenter={onMouseEnter}
        >
          <LayoutGroup>
            {menus.value.map((item, index) => (
              <MenubarItem index={index} item={item} key={item.id} />
            ))}
          </LayoutGroup>
        </menu>
        <MenuViewport onClose={onViewportClose} ref={viewportRef} />
      </MenubarProvider>

      <FlowingLight />
    </nav>
  )
})

const MenubarBackground = defineComponent(() => {
  const offsetX = ref(0)
  const { onMotionChange } = useMotion()

  onMotionChange(motion => (offsetX.value = motion.offsetX))

  return () => (
    <div
      aria-hidden="true"
      class="menubar-background"
      data-role="background"
      style={{ '--offset-x': offsetX.value + 'px' }}
    ></div>
  )
})

const MenubarIndicator = defineComponent(() => {
  const motionX = useMotionValue(0)
  const motionW = useMotionValue(0)
  const { onMotionChange } = useMotion()

  onMotionChange(motion => {
    const { offsetX, itemWidth } = motion
    animate(motionX, offsetX, { type: 'spring', duration: 0.6 })
    animate(motionW, itemWidth, { type: 'spring', duration: 0.6 })
  })

  return () => (
    <motion.div
      aria-hidden="true"
      class="rounded-[--rounded] h-8 absolute -z-1"
      data-role="indicator"
      style={{
        x: motionX,
        width: motionW,
        boxShadow: 'inset 0 0 12px 1px hsl(187 75% 65% / 0.4)'
      }}
    />
  )
})
