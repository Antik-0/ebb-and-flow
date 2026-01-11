import type { NavMenuRecord } from './theme'

export interface MenuItem extends NavMenuRecord {
  /**
   * 是否激活
   */
  active?: boolean
  /**
   * 父节点
   */
  parent?: MenuItem
  /**
   * 导航
   */
  prevNav?: MenuItem
  nextNav?: MenuItem
}
