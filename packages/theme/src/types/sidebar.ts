import type { MenuItemRaw } from './theme.ts'

export interface SidebarItem extends MenuItemRaw {
  /**
   * 是否激活
   */
  acitve?: boolean
  /**
   * 父节点
   */
  parent?: SidebarItem
}
