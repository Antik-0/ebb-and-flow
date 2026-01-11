import type { NavMenuRecord } from './theme'

export interface SidebarMenuItem extends NavMenuRecord {
  /**
   * 是否激活
   */
  active?: boolean
}
