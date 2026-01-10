import type { NavMenuRecord } from './theme.ts'

export interface SidebarMenuItem extends NavMenuRecord {
  /**
   * 是否激活
   */
  active?: boolean
}
