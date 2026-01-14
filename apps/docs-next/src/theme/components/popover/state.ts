import type { EffectKeyframe, Placement, PopoverProps } from './index'
import { useLayoutEffect, useRef, useState } from 'react'
import { useAnimation } from '../../hooks'

type RequiredProps = 'placement' | 'keepAlive' | 'fixed' | 'offset'

type PartialProps = 'effectEnter' | 'effectLeave' | 'onOpen' | 'onClose'

type Props = Required<Pick<PopoverProps, RequiredProps>> &
  Partial<Pick<PopoverProps, PartialProps>>

export function usePopoverState(props: Props) {
  const tRef = useRef<Element | null>(null)
  const vRef = useRef<Element | null>(null)

  // 控制 View 是否渲染
  const [visible, setVisible] = useState(false)
  // 控制 View 是否保持活跃(关闭不会卸载)
  const [isActive, setIsActive] = useState(false)

  const { effectEnter, effectLeave } = props
  const { isAnimating, playEnterAnimation, playLeaveAnimation } =
    usePopoverAnimation({ enter: effectEnter, leave: effectLeave })

  useLayoutEffect(() => {
    if (visible && vRef.current) {
      computeTranslate()
      playEnterAnimation(vRef.current)
      props.onOpen?.()
    }
  }, [visible])

  function open() {
    if (visible || isAnimating.current) {
      return
    }
    setIsActive(true)
    setVisible(true)
  }

  async function close() {
    if (!vRef.current || isAnimating.current) {
      return
    }
    await playLeaveAnimation(vRef.current)
    if (!props.keepAlive) {
      setIsActive(false)
    }
    setVisible(false)
    props.onClose?.()
  }

  const [translate, setTranslate] = useState({ x: 0, y: 0 })

  function computeTranslate() {
    const { placement, offset, fixed } = props

    const [tEle, vEle] = [tRef.current!, vRef.current!]
    const [x, y] = calcPosition(tEle, vEle, offset, placement)

    let [scrollX, scrollY] = [0, 0]
    if (!fixed) {
      const html = document.documentElement
      scrollX = html.scrollLeft
      scrollY = html.scrollTop
    }

    setTranslate({ x: x + scrollX, y: y + scrollY })
  }

  return {
    tRef,
    vRef,
    visible,
    isActive,
    translate,
    open,
    close
  }
}

const defaultMotion: Keyframe[] = [
  { opacity: 0, scale: 0.8 },
  { opacity: 1, scale: 1 }
]
const defaultOption: KeyframeEffectOptions = {
  duration: 200,
  fill: 'forwards'
}

function usePopoverAnimation(keyframes: {
  enter?: EffectKeyframe
  leave?: EffectKeyframe
}) {
  const enterEffect = keyframes.enter
  const leaveEffect = keyframes.leave
  const isAnimating = useRef(false)

  const [enterAnimation, enterScope] = useAnimation(
    enterEffect?.effect ?? defaultMotion,
    enterEffect?.option ?? defaultOption
  )
  const [leaveAnimation, leaveScope] = useAnimation(
    leaveEffect?.effect ?? defaultMotion.toReversed(),
    leaveEffect?.option ?? defaultOption
  )

  const playEnterAnimation = async (target: Element) => {
    isAnimating.current = true
    enterScope.current = target
    enterAnimation.play()
    await enterAnimation.finished
    isAnimating.current = false
  }

  const playLeaveAnimation = async (target: Element) => {
    isAnimating.current = true
    leaveScope.current = target
    leaveAnimation.play()
    await leaveAnimation.finished
    isAnimating.current = false
  }
  return {
    isAnimating,
    playEnterAnimation,
    playLeaveAnimation
  }
}

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

function calcPosition(
  tEle: Element,
  vEle: Element,
  offset: number,
  placement: Placement
) {
  const tRect = tEle.getBoundingClientRect()
  const vRect = vEle.getBoundingClientRect()

  const axisState = placement.split('-') as [string, string]
  const [axis, crossAxis = 'center'] = axisState

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
      offsetX = Math.abs(halfWidthT - halfWidthV) * crossAxisV
      offsetY = (halfHeightT + halfHeightV + offset) * axisV
    } else {
      offsetX = (halfWidthT + halfWidthV + offset) * axisV
      offsetY = Math.abs(halfHeightT - halfHeightV) * crossAxisV
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
