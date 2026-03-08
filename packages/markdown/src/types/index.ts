export type * as HAST from './hast.d.ts'
export type * as MDAST from './mdast.d.ts'

export interface Metadata {
  /**
   * 文章标题
   */
  title: string
  /**
   * toc 导航
   */
  toc: TocItem[]
  /**
   * 最后更新时间
   */
  lastUpdated: number | null
  /**
   * 阅读时间
   */
  readingTime: number
}

export type Data = Record<string, any>

export type PlainObject = Record<string, unknown>

export interface TocItem {
  to: string
  text: string
  level: number
}
