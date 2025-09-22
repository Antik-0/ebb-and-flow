import type { ComponentPublicInstance, MaybeRefOrGetter, ShallowRef } from 'vue'
import { ref, shallowRef, toValue } from 'vue'

export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

type DomOrComponentRef = Element | ComponentPublicInstance | null

const AxisVectors = {
  top: -1,
  right: 1,
  bottom: 1,
  left: -1
} as const

const CrossVectors = {
  center: 0,
  start: 1,
  end: -1
} as const

function calcPostion(
  tRect: DOMRect,
  vRect: DOMRect,
  axis: string,
  crossAxis: string,
  offset: number
) {
  const [halfWidthT, halfHeightT] = [tRect.width / 2, tRect.height / 2]
  const [halfWidthV, halfHeightV] = [vRect.width / 2, vRect.height / 2]

  // 计算 trigger 中心点
  const cx = tRect.left + halfWidthT - halfWidthV
  const cy = tRect.top + halfHeightT - halfHeightV

  // 初始化主轴，交叉轴方向
  const axisV = AxisVectors[axis as keyof typeof AxisVectors]
  const crossAxisV = CrossVectors[crossAxis as keyof typeof CrossVectors]

  const isVertical = ['top', 'bottom'].includes(axis)
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
    const [ox, oy] = calcOffset(newAxisV, newCrossAxisV)
    ;[x, y] = [cx + ox, cy + oy]
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

function unrefEl(ref: ShallowRef<DomOrComponentRef>): Element {
  const value = ref.value
  if (!value) {
    throw new ReferenceError('Popover slots is not Element')
  }
  return (value as ComponentPublicInstance)?.$el ?? value
}

export function usePopoverState(
  placement: MaybeRefOrGetter<Placement>,
  offset: number
) {
  const posX = ref(0)
  const posY = ref(0)

  const tRef = shallowRef<DomOrComponentRef>(null)
  const vRef = shallowRef<DomOrComponentRef>(null)

  const ready = ref(false)

  function onViewMounted() {
    const [tEle, vEle] = [unrefEl(tRef), unrefEl(vRef)]
    const tRect = tEle.getBoundingClientRect()
    const vRect = vEle.getBoundingClientRect()

    const axisState = toValue(placement).split('-') as [string, string]
    const [axis, crossAxis = 'center'] = axisState

    const [x, y] = calcPostion(tRect, vRect, axis, crossAxis, offset)

    posX.value = x
    posY.value = y

    ready.value = true
  }

  function onViewUnmounted() {
    ready.value = false
  }

  return {
    tRef,
    vRef,
    posX,
    posY,
    ready,
    onViewMounted,
    onViewUnmounted
  }
}
