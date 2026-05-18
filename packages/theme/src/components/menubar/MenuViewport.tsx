import type { SlotsType, VNodeChild } from 'vue'
import type { EmptyProps, MenuItem } from '#/types'
import { computed, defineComponent, ref, shallowRef, watch } from 'vue'
import { useMenus } from '#/controller/menus'
import { useMenubar, useViewport, ViewportProvider } from '#/controller/navbar'
import { GlassMask } from '../Effect.tsx'
import { Link } from '../Link.tsx'

export type MenuViewportRef = {
  open: () => void
  close: () => void
}

export const MenuViewport = defineComponent<EmptyProps, { close: () => void }>(
  (_, { emit, expose }) => {
    const menus = useMenus()
    const contents = computed(() => menus.value.map(item => item.items))

    const popover = shallowRef<HTMLDivElement | null>(null)

    const show = ref(false)
    const prevIndex = ref(-1)
    const currIndex = ref(-1)
    const { onHoverIndexChange } = useMenubar()

    function handleIndexChange(index: number) {
      prevIndex.value = currIndex.value
      currIndex.value = index
    }

    onHoverIndexChange(handleIndexChange)

    function onTransitionend(event: TransitionEvent) {
      if (event.currentTarget !== event.target) return
      if (show.value) return
      popover.value?.hidePopover()
      emit('close')
    }

    const contextValue = { prevIndex, currIndex }

    expose({
      open: () => {
        show.value = true
        popover.value?.showPopover()
      },
      close: () => (show.value = false)
    })

    return () => (
      <div
        class="menubar-viewport"
        data-role="menuviewport"
        data-show={show.value}
        onTransitionend={onTransitionend}
        {...{ popover: 'manual' }}
        ref={popover}
      >
        <div class="relative isolate">
          <ViewportProvider value={contextValue}>
            <div class="relative overflow-hidden rounded-4">
              {contents.value.map((content, index) => (
                <MenuViewContent index={index} key={index}>
                  {content && <MenuViewGroup items={content} />}
                </MenuViewContent>
              ))}
            </div>
          </ViewportProvider>
          <GlassMask class="absolute inset-0 -z-1 rounded-4" />
        </div>
      </div>
    )
  },
  { name: 'MenuViewport', emits: ['close'] }
)

type Motion = 'from-start' | 'from-end' | 'to-start' | 'to-end' | undefined

const MenuViewContent = defineComponent<
  { index: number },
  EmptyProps,
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

const MenuViewGroup = defineComponent<{ items: MenuItem[] }>(
  props => {
    const groups = shallowRef<Group[]>(buildGroups(props.items ?? []))

    return () => (
      <div class="p-6">
        {groups.value.map((group, index) => (
          <div class={index !== 0 && 'mt-4'}>
            {group.label && (
              <div class="mb-3 font-600 text-brand text-sm leading-8">
                {group.label}
              </div>
            )}
            <section class="grid gap-4">
              {group.children.map(item => (
                <Link href={item.link} key={item.text}>
                  <span
                    class={[
                      'block rounded-2 p-3 text-foreground',
                      'transition-colors duration-300 ease-out',
                      'hover:bg-brand-2/20 hover:text-brand-2'
                    ]}
                  >
                    <span class="text-nowrap text-sm">{item.text}</span>
                  </span>
                </Link>
              ))}
            </section>
          </div>
        ))}
      </div>
    )
  },
  { name: 'MenuViewGroup', props: ['items'] }
)

interface Group {
  label?: string
  children: MenuItem[]
}

function buildGroups(items: MenuItem[]) {
  const groupMap: Group[] = []
  let group: MenuItem[] = []
  for (const item of items) {
    if (item.items) {
      group.length && groupMap.push({ children: group })
      groupMap.push({ label: item.text, children: item.items })
      group = []
    } else {
      group.push(item)
    }
  }
  group.length && groupMap.push({ children: group })
  return groupMap
}
