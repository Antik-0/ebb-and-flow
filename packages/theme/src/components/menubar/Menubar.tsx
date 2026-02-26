import type { MenuViewportRef } from './MenuViewport'
import { LayoutGroup, animate, motion, useMotionValue } from 'motion-v'
import { defineComponent, ref, shallowRef, watch } from 'vue'
import { useCurrActiveNode, useMenus } from '#/controller/menus'
import {
  MenubarProvider,
  MotionProvider,
  useMenubarMotion,
  useMotionCtx
} from '#/controller/navbar'
import FlowingLight from '../FlowingLight.vue'
import MenubarItem from './MenubarItem.vue'
import MenuViewport from './MenuViewport.tsx'

type HoverChangeCallback = (index: number) => void

export default defineComponent(
  () => {
    const menus = useMenus()
    const currActiveNode = useCurrActiveNode()
    const { scope, updateMotion, onMotionChange } = useMenubarMotion()

    const viewportRef = shallowRef<MenuViewportRef>(null!)
    const onHoverCbs: HoverChangeCallback[] = []
    let activeIndex = -1

    watch(
      () => currActiveNode.value,
      () => {
        const prevActiveIndex = activeIndex
        const activeNode = currActiveNode.value
        if (!activeNode) {
          activeIndex = -1
          return
        }

        const index = Number(activeNode.index.split('_')[0]!)
        if (prevActiveIndex !== index) {
          activeIndex = index
          updateMotion(index)
        }
      },
      { immediate: true }
    )

    function onMenuItemHover(index: number) {
      updateMotion(index)
      for (const cb of onHoverCbs) {
        cb(index)
      }
    }

    function onHoverIndexChange(callback: HoverChangeCallback) {
      onHoverCbs.push(callback)
    }

    function onMouseEnter() {
      viewportRef.value.open()
    }

    function onMouseLeave() {
      viewportRef.value.close()
    }

    function onViewportClose() {
      updateMotion(activeIndex)
    }

    const motionValue = { onMotionChange }
    const contextValue = { onMenuItemHover, onHoverIndexChange }

    return () => (
      <nav
        class="menubar"
        data-role="menubar"
        onPointerleave={onMouseLeave}
        ref={scope}
      >
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
  },
  { name: 'Menubar' }
)

const MenubarBackground = defineComponent(() => {
  const offsetX = ref(0)
  const { onMotionChange } = useMotionCtx()

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
  const { onMotionChange } = useMotionCtx()

  onMotionChange(motion => {
    const { offsetX, itemWidth } = motion
    animate(motionX, offsetX, { type: 'spring', duration: 0.6 })
    animate(motionW, itemWidth, { type: 'spring', duration: 0.6 })
  })

  return () => (
    <motion.div
      aria-hidden="true"
      class="menubar-indicator"
      data-role="indicator"
      style={{ x: motionX, width: motionW }}
    />
  )
})
