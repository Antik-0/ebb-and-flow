import type { ComponentPublicInstance, ShallowRef } from 'vue'
import type { DomOrComponentRef, Placement, PopoverProps } from '.'
import { useAnimation } from '@repo/utils/hooks'
import { computed, nextTick, reactive, ref, shallowRef, watch } from 'vue'

export function usePopoverState(props: Required<PopoverProps>) {
  const isOpend = props.open ?? false

  const isActive = ref(isOpend)
  const show = ref(isOpend)
  const visible = ref(false)
  let requestOpen = isOpend

  const tRef = shallowRef<DomOrComponentRef>(null)
  const vRef = shallowRef<DomOrComponentRef>(null)

  const { isAnimating, playEnterAnimation, playLeaveAnimation } =
    usePopoverAnimation(onAnimationEnd)

  async function open() {
    if (show.value || isAnimating.value) {
      return
    }

    isActive.value = true
    show.value = true
    visible.value = false

    await nextTick()
    if (!unref(vRef)) {
      requestOpen = true
      return
    }

    await computeTranslate()
    visible.value = true
    playEnterAnimation(unref(vRef))
  }

  function close() {
    if (isAnimating.value) return
    playLeaveAnimation(unref(vRef))
  }

  function onAnimationEnd() {
    if (!props.keepAlive) {
      isActive.value = false
    }
    show.value = false
  }

  watch(
    vRef,
    async value => {
      if (value && requestOpen) {
        await computeTranslate()
        visible.value = true
        requestOpen = false
        playEnterAnimation(unref(vRef))
      }
    },
    { flush: 'post' }
  )

  const translate = reactive({ x: 0, y: 0 })

  async function computeTranslate() {
    const { placement, offset, fixed } = props

    const [tEle, vEle] = [unref(tRef), unref(vRef)]
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
    show,
    visible,
    tRef,
    vRef,
    translate,
    open,
    close
  }
}

function usePopoverAnimation(onClose: () => void) {
  const isAnimating = ref(false)

  const keyframes = [
    { opacity: 0, transform: 'translateY(40px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ]
  const options: KeyframeEffectOptions = {
    duration: 600,
    easing: 'ease-in-out'
  }

  const { scope: enterScope, animation: enterAnimation } = useAnimation(
    keyframes,
    { effect: options, onFinish: () => (isAnimating.value = false) }
  )
  const { scope: leaveScope, animation: leaveAnimation } = useAnimation(
    keyframes.reverse(),
    {
      effect: options,
      onFinish: () => {
        isAnimating.value = false
        onClose()
      }
    }
  )

  const playEnterAnimation = (target: Element) => {
    isAnimating.value = true
    enterScope.value = target
    enterAnimation.value?.play()
  }

  const playLeaveAnimation = (target: Element) => {
    isAnimating.value = true
    leaveScope.value = target
    leaveAnimation.value?.play()
  }

  return {
    isAnimating: computed(() => isAnimating.value),
    playEnterAnimation,
    playLeaveAnimation
  }
}

function unref(ref: ShallowRef<DomOrComponentRef>): Element {
  const value = ref.value
  if (!value) {
    throw new ReferenceError('Popover slots is not a Element')
  }
  return (value as ComponentPublicInstance)?.$el ?? value
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
