import { defineComponent, ref, watch } from 'vue'
import DocOutline from '#/components/doc/DocOutline.tsx'
import { GlassMask, ScrollIndicator } from '#/components/Effect.tsx'
import { Popover } from '#/components/popover'
import { useLayout } from '#/controller/layout'
import { useSidebarControl } from '#/controller/sidebar.ts'
import { useAnimation, useFPS } from '#/hooks'
import { BookOpen, PanelLeftClose, PanelLeftOpen, Rocket } from '#/icons'
import SidebarTrigger from './sidebar/SidebarTrigger.vue'

export default defineComponent(
  () => {
    const { isMobile, isTriggerSentinel } = useLayout()
    const { close: closeSidebar } = useSidebarControl()
    const showOutline = ref(false)

    watch(
      () => isMobile.value,
      () => (showOutline.value = false)
    )

    watch(
      () => isTriggerSentinel.value,
      value => {
        if (value === false) {
          showOutline.value = false
          closeSidebar()
        }
      }
    )

    return () => (
      <div
        class={[
          'fixed top-1/2 right-2 z-[--z-index-toolpanel] p-1',
          'translate-x-full opacity-0 transition-all duration-600 ease-out',
          'data-[show=true]:translate-x-0 data-[show=true]:opacity-100'
        ]}
        data-role="toolpanel"
        data-show={isTriggerSentinel.value}
      >
        <div class="flex flex-col gap-1 rounded-5">
          {isMobile.value && (
            <>
              <SidebarButton />
              <OutlineButton
                show={showOutline.value}
                onOnUpdate:show={value => (showOutline.value = value ?? false)}
              />
            </>
          )}
          <Indicator />
          <FPS />
          <BackToTop />
        </div>
        <GlassMask class="absolute inset-0 -z-1 rounded-5" />
      </div>
    )
  },
  { name: 'ToolPanel' }
)

const SidebarButton = defineComponent(
  () => {
    const { isOpen } = useSidebarControl()

    return () => (
      <SidebarTrigger
        class={[
          'flex size-10 flex-center cursor-pointer text-5 text-muted-foreground',
          'transition-color duration-200 hover:text-brand-2'
        ]}
      >
        {isOpen.value ? <PanelLeftOpen /> : <PanelLeftClose />}
      </SidebarTrigger>
    )
  },
  { name: 'SidebarButton' }
)

const OutlineButton = defineComponent<
  { show: boolean },
  { 'onUpdate:show': (value?: boolean) => void }
>(
  (props, { emit }) => {
    function onOutlineClick(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (target.tagName === 'A') {
        emit('onUpdate:show', false)
      }
    }

    return () => (
      <Popover
        delayOpenFrame={2}
        fixed
        keepAlive
        maskClosable={false}
        offset={20}
        open={props.show}
        onUpdate:open={value => emit('onUpdate:show', value)}
        placement="left"
      >
        {{
          trigger: () => (
            <button
              aria-checked={props.show}
              aria-label="outline-button"
              class={[
                'flex size-10 flex-center cursor-pointer text-5 text-muted-foreground',
                'transition-color duration-200 hover:text-brand-2'
              ]}
              role="switch"
              type="button"
            >
              <BookOpen />
            </button>
          ),
          default: () => (
            <div class="relative isolate min-w-60 p-4" onClick={onOutlineClick}>
              <DocOutline />
              <GlassMask class="absolute inset-0 -z-1 rounded-4" />
            </div>
          )
        }}
      </Popover>
    )
  },
  {
    name: 'OutlineButton',
    props: ['show'],
    emits: ['onUpdate:show']
  }
)

const BackToTop = defineComponent(
  () => {
    const [animation, scope] = useAnimation(
      [{ transform: 'translateY(10px)' }, { transform: 'translateY(-100px)' }],
      {
        duration: 1000,
        easing: 'cubic-bezier(0.6, -0.28, 0.74, 0.05)'
      }
    )

    function backToTop() {
      animation.play()
      document.documentElement.scrollIntoView()
    }

    return () => (
      <button
        aria-label="back to top"
        class="flex size-10 flex-center cursor-pointer text-6 text-muted-foreground hover:text-brand-3"
        onClick={backToTop}
        ref={scope}
        title="回到顶部"
        type="button"
      >
        <Rocket />
      </button>
    )
  },
  { name: 'BackToTop' }
)

const FPS = defineComponent(
  () => {
    const fps = useFPS()

    return () => (
      <div class="size-10 flex-col items-center justify-between text-teal">
        <span class="text-3 leading-[1]">fps</span>
        <span class="text-14px leading-6">{fps.value}</span>
      </div>
    )
  },
  { name: 'FPS' }
)

function Indicator() {
  return (
    <div class="flex size-10 flex-center text-6 text-teal">
      <ScrollIndicator />
    </div>
  )
}
