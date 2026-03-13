export type * as HAST from './hast.d.ts'
export type * as MDAST from './mdast.d.ts'

export type Data = Record<string, any>

export type Props = Record<string, any>

export type VNode = string | [string, Props, VNode[]] | null

export type Frontmatter = Record<string, any>

export interface TocItem {
  id: string
  label: string
  level: number
}

export interface TabItem {
  text: string
  icon: string
}

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

export interface VFileData {
  metadata: Metadata
  frontmatter?: Frontmatter
}

export interface MarkdownData {
  body: VNode[]
  metadata: Metadata
  frontmatter?: Frontmatter
}
