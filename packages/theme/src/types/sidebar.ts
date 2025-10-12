import type { MenuItemRaw } from './theme.ts'

export interface SidebarItem extends MenuItemRaw {
  /**
   * 是否激活
   */
  active?: boolean
}
