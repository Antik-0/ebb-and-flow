import type { MenuItemRaw } from './theme.ts'

export interface MenuItem extends MenuItemRaw {
  /**
   * 是否激活
   */
  acitve?: boolean
  /**
   * 父节点
   */
  parent?: MenuItem
}
