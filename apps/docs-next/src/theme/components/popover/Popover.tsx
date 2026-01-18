import type { PropsWithChildren, RefObject } from 'react'
import type { Timer, WithHTMLProps } from '../../types'
import type { PopoverProps } from './index'
import { clsx } from '@repo/utils'
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useEffectEvent,
  useRef
} from 'react'
import { createPortal } from 'react-dom'
import { stylex } from '#/utils'
import { useEventListener } from '../../hooks'
import { usePopoverState } from './state'

function Popover(props: PropsWithChildren<PopoverProps>) {
  const {
    isOpen,
    onOpenChange,
    trigger = 'click',
    placement = 'bottom',
    maskClosable = true,
    keepAlive = false,
    fixed = false,
    offset = 10,
    delayClose = 200,
    children,
    onOpen,
    onClose
  } = props

  const { tRef, vRef, visible, isActive, translate, open, close } =
    usePopoverState({ placement, keepAlive, fixed, offset, onOpen, onClose })

  console.log('render')

  useEffect(() => {
    if (isOpen) {
      handleOpen()
    } else {
      handleClose()
    }
  }, [isOpen])

  const handleOpen = () => {
    if (visible) return
    open()
    onOpenChange?.(true)
  }

  const handleClose = () => {
    if (!visible) return
    close()
    onOpenChange?.(false)
  }

  const timer = useRef<Timer | null>(null)

  const { addEventListener } = useEventListener()

  const onClickOutside = useEffectEvent((event: PointerEvent) => {
    console.log('onClickOutside')
    if (!visible) return
    const elements = event.composedPath()
    const tDOM = tRef.current
    const vDOM = vRef.current
    for (const ele of elements) {
      if (ele === tDOM || ele === vDOM) {
        return
      }
    }
    handleClose()
  })

  useEffect(() => {
    if (maskClosable && trigger === 'click') {
      addEventListener(window, 'click', onClickOutside)
    }
  }, [])

  const ctxValue: PopoverContext = {
    tRef,
    vRef,
    timer,
    trigger,
    fixed,
    delayClose,
    visible,
    isActive,
    translate,
    handleOpen,
    handleClose
  }

  return <PopoverContext value={ctxValue}>{children}</PopoverContext>
}

interface PopoverContext {
  tRef: RefObject<Element | null>
  vRef: RefObject<Element | null>
  timer: RefObject<Timer | null>
  trigger?: 'hover' | 'click'
  fixed: boolean
  delayClose: number
  visible: boolean
  isActive: boolean
  translate: { x: number; y: number }
  handleOpen: () => void
  handleClose: () => void
}

const PopoverContext = createContext({} as PopoverContext)

function PopoverTrigger({ children }: PropsWithChildren) {
  const { tRef, timer, trigger, delayClose, visible, handleOpen, handleClose } =
    useContext(PopoverContext)

  if (!isValidElement(children) || Array.isArray(children)) {
    return null
  }

  const onClick = () => {
    visible ? handleClose() : handleOpen()
  }

  const onPointerEnter = () => {
    timer.current && window.clearTimeout(timer.current)
    handleOpen()
  }

  const onPointerLeave = () => {
    timer.current = setTimeout(handleClose, delayClose)
  }

  const events =
    trigger === 'click' ? { onClick } : { onPointerEnter, onPointerLeave }

  return cloneElement<any>(children, { ref: tRef, ...events })
}

interface PopoverContentProps extends WithHTMLProps {}

function PopoverContent(props: PropsWithChildren<PopoverContentProps>) {
  const { className, style, children, ...restProps } = props
  const {
    vRef,
    timer,
    trigger,
    fixed,
    visible,
    isActive,
    translate,
    handleClose
  } = useContext(PopoverContext)

  if (!isActive) return null

  const wrapperStyle = stylex(
    {
      '--x': `${translate.x}px`,
      '--y': `${translate.y}px`,
      display: !visible && 'none',
      position: fixed ? 'fixed' : 'absolute',
      translate: 'var(--x) var(--y)'
    },
    style
  )

  function onPointerEnter() {
    timer.current && window.clearTimeout(timer.current)
  }

  function onPointerLeave() {
    trigger === 'hover' && handleClose()
  }

  const content = (
    <div
      className={clsx(
        'contain-layout pointer-events-none left-0 top-0 z-1000',
        className
      )}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      ref={vRef as any}
      style={wrapperStyle}
      {...restProps}
    >
      {children}
    </div>
  )

  return createPortal(content, document.body)
}

Popover.Trigger = PopoverTrigger
Popover.Content = PopoverContent

export { Popover }
