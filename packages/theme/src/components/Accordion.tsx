import type {
  InjectionKey,
  SlotsType,
  StyleValue,
  VNode,
  VNodeChild
} from 'vue'
import type { EmptyProps } from '#/types'
import { clsx } from '@repo/utils'
import {
  computed,
  defineComponent,
  h,
  inject,
  nextTick,
  onMounted,
  provide,
  ref,
  shallowRef
} from 'vue'

function useAccordion() {
  const scope = shallowRef<HTMLElement>()
  const height = ref(0)
  const hidden = ref(true)
  const collapsed = ref(true)

  async function open() {
    hidden.value = false
    collapsed.value = false
    await nextTick()
    height.value = scope.value!.scrollHeight
  }

  function fold() {
    height.value = 0
    collapsed.value = true
  }

  return {
    scope,
    height,
    hidden,
    collapsed,
    open,
    fold
  }
}

type AccordionContext = ReturnType<typeof useAccordion>

function createAccordionContext() {
  const contextKey = Symbol() as InjectionKey<AccordionContext>

  const provider = (value: AccordionContext) => provide(contextKey, value)

  const useContext = () => inject(contextKey)!

  return [provider, useContext] as const
}

const [provideAccordion, useAccordionCtx] = createAccordionContext()

export const Accordion = defineComponent<
  { defaultValue?: boolean },
  EmptyProps,
  '',
  SlotsType<{ default: () => VNodeChild }>
>(
  (props, { slots }) => {
    const { scope, height, hidden, collapsed, open, fold } = useAccordion()

    onMounted(() => {
      if (props.defaultValue === false) {
        open()
      }
    })

    const context = {
      scope,
      height,
      hidden,
      collapsed,
      open,
      fold
    }
    provideAccordion(context)

    return () => slots.default()
  },
  { name: 'Accordion', props: ['defaultValue'] }
)

export const AccordionTrigger = defineComponent<
  EmptyProps,
  EmptyProps,
  '',
  SlotsType<{ default: () => VNode[] }>
>(
  (_, { attrs, slots }) => {
    const { collapsed, open, fold } = useAccordionCtx()

    function trigger() {
      if (collapsed.value) {
        open()
      } else {
        fold()
      }
    }

    return () => {
      const children = slots.default()
      if (!children || children.length > 1) {
        return null
      }
      const vnode = children[0]!
      return h(vnode, {
        ...attrs,
        'aria-expanded': !collapsed.value,
        onClick: trigger
      })
    }
  },
  { name: 'AccordionTrigger' }
)

export const AccordionContent = defineComponent<
  { class?: string; style?: StyleValue },
  EmptyProps,
  '',
  SlotsType<{ default: () => VNodeChild }>
>(
  (props, { attrs, slots }) => {
    const { scope, height, hidden, collapsed } = useAccordionCtx()

    function onTransitionEnd(event: TransitionEvent) {
      event.stopImmediatePropagation()
      event.preventDefault()
      if (collapsed.value) {
        hidden.value = true
      }
    }

    const style = computed<StyleValue>(() => {
      return [
        props.style,
        { '--m-value-x': height.value + 'px' },
        { maxHeight: 'var(--m-value-x)' },
        { 'transition-property': '--m-value-x' }
      ]
    })

    return () => (
      <div
        class={clsx('overflow-hidden duration-300 ease-out', props.class)}
        data-collapsed={collapsed.value}
        onTransitionend={onTransitionEnd}
        ref={scope}
        style={style.value}
        v-show={!hidden.value}
        {...attrs}
      >
        {slots.default()}
      </div>
    )
  },
  { name: 'AccordionContent', props: ['class', 'style'] }
)
