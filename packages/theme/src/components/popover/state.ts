import type { ComponentPublicInstance, ShallowRef } from 'vue'
import type { EffectKeyframe, Placement, PopoverProps } from '.'
import { nextAnimationFrame } from '@repo/utils'
import { computed, reactive, ref, shallowRef, watch } from 'vue'
import { useAnimation } from '#/hooks'

type PartialProps = 'effectEnter' | 'effectLeave' | 'onOpen' | 'onClose'

type Props = Required<Omit<PopoverProps, PartialProps>> &
  Partial<Pick<PopoverProps, PartialProps>>

export function usePopoverState(props: Props) {
  const isOpend = props.open ?? false

  const isActive = ref(isOpend)
  const visible = ref(isOpend)
  let requestOpen = isOpend

  const isHidden = ref(false)

  const tRef = shallowRef<ComponentPublicInstance | Element | null>(null)
  const vRef = shallowRef<Element | null>(null)

  const { effectEnter, effectLeave } = props
  const { isAnimating, playEnterAnimation, playLeaveAnimation } =
    usePopoverAnimation({ enter: effectEnter, leave: effectLeave })

  async function open() {
    if (visible.value || isAnimating.value) {
      return
    }

    props.onOpen?.()
    isActive.value = true
    visible.value = true
    isHidden.value = true

    await nextAnimationFrame(props.delayOpenFrame)

    const target = unref(vRef)
    if (!target) {
      requestOpen = true
      return
    }

    computeTranslate()
    playEnterAnimation(target)
    isHidden.value = false
  }

  async function close() {
    if (isAnimating.value) return

    const target = unref(vRef)!
    await playLeaveAnimation(target)

    if (!props.keepAlive) {
      isActive.value = false
    }
    visible.value = false
    props.onClose?.()
  }

  watch(
    vRef,
    async viewRef => {
      if (viewRef && requestOpen) {
        requestOpen = false
        computeTranslate()
        playEnterAnimation(viewRef)
        isHidden.value = false
      }
    },
    { flush: 'post' }
  )

  const translate = reactive({ x: 0, y: 0 })

  function computeTranslate() {
    const { placement, offset, fixed } = props

    const [tEle, vEle] = [unref(tRef)!, unref(vRef)!]
    const [x, y] = calcPosition(tEle, vEle, offset, placement)

    let [scrollX, scrollY] = [0, 0]
    if (!fixed) {
      const html = document.documentElement
      scrollX = html.scrollLeft
      scrollY = html.scrollTop
    }

    translate.x = x + scrollX
    translate.y = y + scrollY
  }

  return {
    isActive,
    visible,
    isHidden,
    tRef,
    vRef,
    translate,
    open,
    close
  }
}

function usePopoverAnimation(keyframes: {
  enter?: EffectKeyframe
  leave?: EffectKeyframe
}) {
  const defaultMotion = [
    { transform: 'translateY(20px)' },
    { transform: 'translateY(0)' }
  ]
  const defaultOption: KeyframeEffectOptions = {
    duration: 200
  }

  const enterEffect = keyframes.enter
  const leaveEffect = keyframes.leave

  const isAnimating = ref(false)
  const [enterAnimation, enterScope] = useAnimation(
    enterEffect?.effect ?? defaultMotion,
    enterEffect?.option ?? defaultOption
  )
  const [leaveAnimation, leaveScope] = useAnimation(
    leaveEffect?.effect ?? defaultMotion.toReversed(),
    leaveEffect?.option ?? defaultOption
  )

  const playEnterAnimation = async (target: Element) => {
    isAnimating.value = true
    enterScope.value = target
    enterAnimation.play()
    await enterAnimation.finished
    isAnimating.value = false
  }

  const playLeaveAnimation = async (target: Element) => {
    isAnimating.value = true
    leaveScope.value = target
    leaveAnimation.play()
    await leaveAnimation.finished
    isAnimating.value = false
  }

  return {
    isAnimating: computed(() => isAnimating.value),
    playEnterAnimation,
    playLeaveAnimation
  }
}

function unref(value: ShallowRef<ComponentPublicInstance | Element | null>) {
  const _value = value.value
  if (_value === null) return null
  if (Reflect.has(_value, '$el')) {
    return Reflect.get(_value, '$el') as Element | null
  }
  return _value as Element | null
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
