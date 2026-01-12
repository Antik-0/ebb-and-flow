import type { NavMenuRecord } from './theme'

export interface MenuItem extends NavMenuRecord {
  /**
   * 节点id
   */
  id: number
  /**
   * 父节点
   */
  parent: MenuItem | null
  /**
   * 子节点
   */
  items?: MenuItem[]
  /**
   * 导航
   */
  prevNav?: MenuItem
  nextNav?: MenuItem
}
