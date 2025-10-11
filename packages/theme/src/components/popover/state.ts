import type { ComponentPublicInstance, ShallowRef } from 'vue'
import type { Fn } from '#/types'
import type { DomOrComponentRef, PopoverProps } from './types.ts'
import { animate, useMotionValue } from 'motion-v'
import { ref, shallowRef } from 'vue'

/**
 * 主轴矢量
 */
const AxisVectors = {
  top: -1,
  right: 1,
  bottom: 1,
  left: -1
} as const

/**
 * 交叉轴矢量
 */
const CrossVectors = {
  center: 0,
  start: 1,
  end: -1
} as const

function calcFixedPosition(
  tRect: DOMRect,
  vRect: DOMRect,
  axis: string,
  crossAxis: string,
  offset: number
) {
  const [halfWidthT, halfHeightT] = [tRect.width / 2, tRect.height / 2]
  const [halfWidthV, halfHeightV] = [vRect.width / 2, vRect.height / 2]

  // 计算 view 移动到 trigger 中心的位置
  // ✨ 这里减去 (halfWidthV/halfHeightV) 是因为 view 初始位置位于左上角
  const cx = tRect.left + halfWidthT - halfWidthV
  const cy = tRect.top + halfHeightT - halfHeightV

  // 初始化主轴/交叉轴方向
  const axisV = AxisVectors[axis as keyof typeof AxisVectors]
  const crossAxisV = CrossVectors[crossAxis as keyof typeof CrossVectors]

  const isVertical = ['top', 'bottom'].includes(axis)

  // 根据位置计算偏移量
  const calcOffset = (axisV: number, crossAxisV: number) => {
    let [offsetX, offsetY] = [0, 0]
    if (isVertical) {
      offsetX = (Math.abs(halfWidthT - halfWidthV) + offset) * crossAxisV
      offsetY = (halfHeightT + halfHeightV + offset) * axisV
    } else {
      offsetX = (halfWidthT + halfWidthV + offset) * axisV
      offsetY = (Math.abs(halfHeightT - halfHeightV) + offset) * crossAxisV
    }
    return [offsetX, offsetY] as const
  }

  const [offsetX, offsetY] = calcOffset(axisV, crossAxisV)
  let [x, y] = [cx + offsetX, cy + offsetY]

  // 边界检查
  const [newAxisV, newCrossAxisV] = boundaryCheck(
    x,
    y,
    vRect,
    axisV,
    crossAxisV,
    isVertical
  )
  if (newAxisV !== axisV || newCrossAxisV !== crossAxisV) {
    // 越界，重新计算
    const [newOffsetX, newOffsetY] = calcOffset(newAxisV, newCrossAxisV)
    ;[x, y] = [cx + newOffsetX, cy + newOffsetY]
  }

  return [x, y] as const
}

function boundaryCheck(
  x: number,
  y: number,
  vRect: DOMRect,
  axisV: number,
  crossAxisV: number,
  vertical: boolean
) {
  const { innerWidth, innerHeight } = window
  const { width, height } = vRect
  if (vertical) {
    if (y <= 0 || y + height >= innerHeight) {
      axisV *= -1
    }
    if (x <= 0) {
      crossAxisV = CrossVectors.start
    }
    if (x >= innerWidth) {
      crossAxisV = CrossVectors.end
    }
  } else {
    if (x <= 0 || x + width >= innerWidth) {
      axisV *= -1
    }
    if (y <= 0) {
      crossAxisV = CrossVectors.start
    }
    if (y >= innerHeight) {
      crossAxisV = CrossVectors.end
    }
  }
  return [axisV, crossAxisV] as const
}

function unref(ref: ShallowRef<DomOrComponentRef>): Element {
  const value = ref.value
  if (!value) {
    throw new ReferenceError('Popover slots is not a Element')
  }
  return (value as ComponentPublicInstance)?.$el ?? value
}

export function usePopoverState(props: Required<PopoverProps>) {
  const posX = ref(0)
  const posY = ref(0)

  const tRef = shallowRef<DomOrComponentRef>(null)
  const vRef = shallowRef<DomOrComponentRef>(null)

  const readyCallbacks: Fn[] = []

  function onViewMounted() {
    const { placement, offset, fixed } = props

    const [tEle, vEle] = [unref(tRef), unref(vRef)]
    const tRect = tEle.getBoundingClientRect()
    const vRect = vEle.getBoundingClientRect()

    const axisState = placement.split('-') as [string, string]
    const [axis, crossAxis = 'center'] = axisState

    const [x, y] = calcFixedPosition(tRect, vRect, axis, crossAxis, offset)

    let [scrollX, scrollY] = [0, 0]
    if (!fixed) {
      const html = document.documentElement
      scrollX = html.scrollLeft
      scrollY = html.scrollTop
    }

    posX.value = x + scrollX
    posY.value = y + scrollY

    for (const fn of readyCallbacks) {
      fn()
    }
  }

  function onViewReady(fn: Fn) {
    if (readyCallbacks.includes(fn)) {
      return
    }
    readyCallbacks.push(fn)
  }

  return {
    tRef,
    vRef,
    posX,
    posY,
    onViewReady,
    onViewMounted
  }
}

const initialY = 40
const iniialOpacity = 0

export function usePopoverMotion() {
  const opacity = useMotionValue(iniialOpacity)
  const translateY = useMotionValue(initialY)
  const animating = shallowRef(false)

  function createMotion(motions: (onComplete: () => void) => void) {
    let signal = 2
    animating.value = true
    return new Promise<boolean>(resolve => {
      const onComplete = () => {
        signal -= 1
        if (signal === 0) {
          resolve(true)
          animating.value = false
        }
      }
      motions(onComplete)
    })
  }

  function startOpenMotion() {
    return createMotion(onComplete => {
      animate(opacity, 1, { duration: 0.6, onComplete })
      animate(translateY, 0, { type: 'spring', duration: 0.6, onComplete })
    })
  }

  function startCloseMotion() {
    return createMotion(onComplete => {
      animate(opacity, iniialOpacity, { duration: 0.4, onComplete })
      animate(translateY, initialY, {
        ease: 'easeIn',
        duration: 0.4,
        onComplete
      })
    })
  }

  return {
    opacity,
    translateY,
    animating,
    startOpenMotion,
    startCloseMotion
  }
}
