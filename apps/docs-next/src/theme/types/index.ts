import type { HTMLAttributes } from 'react'

export type Fn = (...args: any[]) => any

export type Timer = NodeJS.Timeout | number

export interface Page {
  /**
   * 页面标题
   */
  title: string
  /**
   * 页面导航
   */
  toc?: OutlineAnchor[]
}

export interface OutlineAnchor {
  /**
   * 文本
   */
  text: string
  /**
   * 锚点
   */
  to: string
  /**
   * 层级
   */
  level: number
}

export type WithHTMLProps<T = HTMLDivElement> = HTMLAttributes<T>

export * from './menu.ts'
export * from './sidebar.ts'
export * from './theme.ts'
