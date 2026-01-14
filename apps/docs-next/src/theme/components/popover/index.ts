export { Popover } from './Popover.tsx'

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

export interface PopoverProps {
  /**
   * 是否打开
   */
  isOpen?: boolean

  /**
   * `open` 变化回调
   */
  onOpenChange?: (open: boolean) => void

  /**
   * 触发方式
   * @default 'click'
   */
  trigger?: 'hover' | 'click'

  /**
   * 出现位置
   * @default 'bottom'
   */
  placement?: Placement

  /**
   * 点击蒙层是否允许关闭
   * @default true
   */
  maskClosable?: boolean

  /**
   * 是否缓存(关闭后，不会卸载组件)
   * @default false
   */
  keepAlive?: boolean

  /**
   * 是否应用 fixed 布局
   * @default false
   */
  fixed?: boolean

  /**
   * 偏移量
   * @default 10
   */
  offset?: number

  /**
   * 关闭延迟时间: ms
   * @default 200
   */
  delayClose?: number

  /**
   * 进入动画
   */
  effectEnter?: EffectKeyframe

  /**
   * 退出动画
   */
  effectLeave?: EffectKeyframe

  /**
   * 打开回调: 动画前
   */
  onOpen?: () => void

  /**
   * 关闭回调: 动画后
   */
  onClose?: () => void
}

export interface EffectKeyframe {
  effect?: Keyframe[] | PropertyIndexedKeyframes | null
  option?: KeyframeEffectOptions
}
