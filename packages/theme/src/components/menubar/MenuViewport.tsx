import type { SlotsType, VNodeChild } from 'vue'
import type { Empty } from '#/types'
import { AnimatePresence, motion } from 'motion-v'
import { computed, defineComponent, ref, watch } from 'vue'
import { useMenus } from '#/controller/menus'
import { useMenubar, useViewport, ViewportProvider } from '#/controller/navbar'
import GlassMask from '../GlassMask.vue'
import MenuViewGroup from './MenuViewGroup.vue'

export type MenuViewportRef = {
  open: () => void
  close: () => void
}

export default defineComponent<Empty, { close: () => void }>(
  (_, { emit, expose }) => {
    const menus = useMenus()
    const contents = computed(() => menus.value.map(item => item.items))

    const show = ref(false)
    const prevIndex = ref(-1)
    const currIndex = ref(-1)
    const { onHoverIndexChange } = useMenubar()

    function handleIndexChange(index: number) {
      prevIndex.value = currIndex.value
      currIndex.value = index
    }

    onHoverIndexChange(handleIndexChange)

    function onExitComplete() {
      !show.value && emit('close')
    }

    const contextValue = { prevIndex, currIndex }

    expose({
      open: () => (show.value = true),
      close: () => (show.value = false)
    })

    return () => (
      <AnimatePresence onExitComplete={onExitComplete}>
        {show.value && (
          <motion.div
            animate={{ y: 0 }}
            class="pt-2 min-w-full contain-layout left-1/2 top-full absolute isolate -translate-x-1/2"
            data-role="menuviewport"
            exit={{ opacity: 0, y: 40 }}
            initial={{ y: 40 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <div class="relative isolate">
              <ViewportProvider value={contextValue}>
                <div class="rounded-4 relative overflow-hidden">
                  {contents.value.map((content, index) => (
                    <MenuViewContent index={index} key={index}>
                      {content && <MenuViewGroup items={content} />}
                    </MenuViewContent>
                  ))}
                </div>
              </ViewportProvider>
              <GlassMask class="rounded-4 inset-0 absolute -z-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  },
  { name: 'MenuViewport', emits: ['close'] }
)

type Motion = 'from-start' | 'from-end' | 'to-start' | 'to-end' | undefined

const MenuViewContent = defineComponent<
  { index: number },
  Empty,
  '',
  SlotsType<{ default: () => VNodeChild }>
>(
  (props, { slots }) => {
    const { currIndex, prevIndex } = useViewport()

    const show = ref(false)
    const active = ref(false)
    const motion = ref<Motion>(undefined)

    watch(
      () => [currIndex.value, prevIndex.value],
      value => {
        const [currIndex, prevIndex] = value as [number, number]
        const isFromEnd = currIndex > prevIndex
        const index = props.index
        if (index === currIndex) {
          motion.value = isFromEnd ? 'from-end' : 'from-start'
        } else if (index === prevIndex) {
          motion.value = isFromEnd ? 'to-start' : 'to-end'
        }
        show.value = index === currIndex || index === prevIndex
        active.value = index === currIndex
      },
      { immediate: true }
    )

    function onAnimationEnd() {
      if (props.index === currIndex.value) {
        return
      }
      if (props.index === prevIndex.value) {
        show.value = false
      }
    }

    return () => {
      const children = slots.default()
      if (!children) return null

      return (
        <div
          class="menu-content"
          data-active={active.value}
          data-index={props.index}
          data-motion={motion.value}
          onAnimationend={onAnimationEnd}
          v-show={show.value}
        >
          {children}
        </div>
      )
    }
  },
  { props: ['index'] }
)
