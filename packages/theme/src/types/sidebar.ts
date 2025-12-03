import type { NavMenuRecord } from './theme.ts'

export interface SidebarItem extends NavMenuRecord {
  /**
   * 是否激活
   */
  active?: boolean
}
