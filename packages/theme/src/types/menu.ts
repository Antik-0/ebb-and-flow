import type { NavMenuRecord } from './theme.ts'

export interface MenuItem extends NavMenuRecord {
  /**
   * 节点id
   */
  id: number
  /**
   * 子节点
   */
  items?: MenuItem[]
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
