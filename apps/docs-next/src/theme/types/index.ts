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
  toc?: TocItem[]
}

export interface TocItem {
  /**
   * 锚点
   */
  id: string
  /**
   * 文本
   */
  label: string
  /**
   * 层级
   */
  level: number
}

export type WithHTMLProps<T = HTMLDivElement> = HTMLAttributes<T>

export * from './menu.ts'
export * from './theme.ts'
