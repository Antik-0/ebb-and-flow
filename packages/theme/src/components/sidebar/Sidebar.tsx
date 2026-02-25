import type { SlotsType, VNodeChild } from 'vue'
import type { Empty } from '#/types'
import { animate, motion, useMotionValue } from 'motion-v'
import { defineComponent, onMounted, useTemplateRef, watch } from 'vue'
import { useSidebarControl, useSidebarMenus } from '#/controller/sidebar'
import { useEventListener, useResizeObserver } from '#/hooks'
import GlassMask from '../GlassMask.vue'
import SidebarGroup from './SidebarGroup.vue'

export default defineComponent(
  () => {
    const { isOpen, close } = useSidebarControl()
    const x = useMotionValue(isOpen.value ? '0%' : '-100%')

    watch(
      () => isOpen.value,
      opened => {
        if (opened) {
          animate(x, '0%', { type: 'spring', duration: 0.6 })
        } else {
          animate(x, '-100%', { ease: 'backIn', duration: 0.6 })
        }
      }
    )

    const sidebar = useTemplateRef<HTMLDivElement>('sidebar')
    const { addEventListener } = useEventListener()

    onMounted(() => {
      addEventListener(
        () => sidebar.value,
        'click',
        event => {
          for (const path of event.composedPath()) {
            const node = path as HTMLElement
            if (node === document.body) break
            if (node.getAttribute('data-role') === 'route') {
              close()
              break
            }
          }
        }
      )
    })

    return () => (
      <motion.aside class="ebb-sidebar" data-role="sidebar" style={{ x }}>
        <div class="grid-full px-1 py-4 flex-col min-h-0" ref="sidebar">
          <SidebarContent />
        </div>
        <SidebarMask />
      </motion.aside>
    )
  },
  { name: 'Sidebar' }
)

const SidebarContent = defineComponent(
  () => {
    const sidebarMenus = useSidebarMenus()

    return () => (
      <div
        class="px-3 flex-1 overflow-x-hidden overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--c-scrollbar) transparent'
        }}
      >
        {sidebarMenus.value.map((item, index) => (
          <SidebarGroup item={item} key={index} />
        ))}
      </div>
    )
  },
  { name: 'SidebarContent' }
)

function SidebarMask() {
  return (
    <div class="sidebar-mask w-100 inset-y-0 right-0 absolute -z-1">
      <GlassMask style={{ '--fit-size': 'contain' }} />
    </div>
  )
}

export const SidebarContainer = defineComponent<
  Empty,
  Empty,
  '',
  SlotsType<{ default: () => VNodeChild }>
>(
  (_, { slots }) => {
    const container = useTemplateRef<HTMLDivElement>('container')
    const { disabled, open, close } = useSidebarControl()

    const { observe } = useResizeObserver()
    onMounted(() => {
      disabled.value = false
      observe(
        () => container.value,
        entry => {
          const boxSize = entry.borderBoxSize[0]!
          const inlineSize = boxSize.inlineSize
          if (inlineSize >= 320) {
            open()
            disabled.value = true
          } else {
            disabled.value = false
            close()
          }
        }
      )
    })

    return () => (
      <div class="sidebar-container" ref="container">
        {slots.default()}
      </div>
    )
  },
  { name: 'SidebarContainer' }
)

export const SidebarOverlay = defineComponent(
  () => {
    const { isOpen, close } = useSidebarControl()

    return () => (
      <div
        aria-hidden="true"
        class="sidebar-overlay bg-black/20 inset-0 fixed"
        onClick={close}
        v-show={isOpen.value}
      ></div>
    )
  },
  { name: 'SidebarOverlay' }
)
