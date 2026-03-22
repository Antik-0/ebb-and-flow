import type {
  CSSProperties,
  PropsWithChildren,
  RefObject,
  TransitionEvent
} from 'react'
import { clsx } from '@repo/utils'
import {
  cloneElement,
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { stylex } from '#/utils'

function useAccordion() {
  const scope = useRef<HTMLDivElement>(null!)
  const [height, setHeight] = useState(0)
  const [hidden, setHidden] = useState(true)
  const [collapsed, setCollapsed] = useState(true)

  useEffect(() => {
    if (collapsed === false) {
      setHeight(scope.current!.scrollHeight)
    }
  }, [collapsed])

  function open() {
    setHidden(false)
    setCollapsed(false)
  }

  function fold() {
    setHeight(0)
    setCollapsed(true)
  }

  function onTransitionEnd(event: TransitionEvent) {
    event.stopPropagation()
    event.preventDefault()
    if (collapsed) {
      setHidden(true)
    }
  }

  return {
    scope,
    height,
    hidden,
    collapsed,
    open,
    fold,
    onTransitionEnd
  }
}

interface AccordionContext {
  scope: RefObject<HTMLDivElement>
  height: number
  hidden: boolean
  collapsed: boolean
  open: () => void
  fold: () => void
  onTransitionEnd: (event: TransitionEvent) => void
}

function createAccordionContext() {
  const Context = createContext({} as AccordionContext)

  const Provider = (props: PropsWithChildren<{ value: AccordionContext }>) => {
    const { value, children } = props
    return createElement(Context, { value }, children)
  }

  const useCtx = () => useContext(Context)

  return [Provider, useCtx] as const
}

const [AccordionProvider, useAccordionCtx] = createAccordionContext()

export function Accordion(
  props: PropsWithChildren<{ defaultValue?: boolean }>
) {
  const { defaultValue, children } = props
  const { open, ...rest } = useAccordion()

  useEffect(() => {
    if (defaultValue === false) {
      open()
    }
  }, [])

  const context = { open, ...rest }

  return <AccordionProvider value={context}>{children}</AccordionProvider>
}

export function AccordionTrigger(props: PropsWithChildren) {
  const { children, ...attrs } = props
  const { collapsed, open, fold } = useAccordionCtx()

  function trigger() {
    if (collapsed) {
      open()
    } else {
      fold()
    }
  }

  const isArray = Array.isArray(children)
  if (!children || (isArray && children.length > 1)) {
    return null
  }

  const vnode = isArray ? children[0] : children
  return cloneElement(vnode, {
    ...attrs,
    'aria-expanded': !collapsed,
    onClick: trigger
  })
}

export function AccordionContent(
  props: PropsWithChildren<{
    className?: string
    style?: CSSProperties
  }>
) {
  const { className, style, children, ...attrs } = props
  const { scope, height, hidden, collapsed, onTransitionEnd } =
    useAccordionCtx()

  const _style = stylex(
    style,
    hidden && { display: 'none' },
    { '--m-value-x': height + 'px' },
    { maxHeight: 'var(--m-value-x)' },
    { 'transition-property': '--m-value-x' }
  )

  return (
    <div
      className={clsx('duration-300 ease-out overflow-hidden', className)}
      data-collapsed={collapsed}
      onTransitionEnd={onTransitionEnd}
      ref={scope}
      style={_style}
      {...attrs}
    >
      {children}
    </div>
  )
}
