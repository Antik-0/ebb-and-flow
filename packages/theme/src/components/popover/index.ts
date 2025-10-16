export { default as Popover } from './Popover.vue'

import type { ComponentPublicInstance } from 'vue'

export type DomOrComponentRef = Element | ComponentPublicInstance | null

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
  open?: boolean
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
   */
  maskClosable?: boolean

  /**
   * 是否缓存(关闭后，不会卸载组件)
   */
  keepAlive?: boolean

  /**
   * 是否应用 fixed 布局
   */
  fixed?: boolean

  /**
   * 宽度
   * @default 150
   */
  width?: number

  /**
   * 偏移量
   */
  offset?: number

  /**
   * 延迟关闭时间
   */
  closeDelay?: number

  /**
   * 关闭回调
   */
  onClose?: () => void
}
