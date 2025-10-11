import type { ComponentPublicInstance } from 'vue'

export interface PopoverProps {
  /**
   * 触发方式
   * @default 'click'
   */
  trigger?: 'hover' | 'click'

  /**
   * 出现位置
   * @default 'bottom'
   */
  placement?:
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
}

export type DomOrComponentRef = Element | ComponentPublicInstance | null
