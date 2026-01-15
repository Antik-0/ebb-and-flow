export type * as HAST from 'hast'
export type * as MDAST from 'mdast'

export interface Metadata {
  /**
   * 最后更新时间
   */
  lastUpdated: number | null
  /**
   * 阅读时间
   */
  readingTime: number
  /**
   * toc 导航
   */
  toc: TocItem[]
}

export type Data = Record<string, string | number | boolean | null>

export type PlainObject = Record<string, unknown>

export interface TocItem {
  text: string
  level: number
}

/**
 * AST Descriptor Syntax
 *
 * refer: https://github.com/estree/estree/blob/master/es5.md
 */

export interface ASTNode {
  type: string
}

export type LiteralValue = string | number | boolean | null

export interface Literal extends ASTNode {
  type: 'Literal'
  value: LiteralValue
}

export interface Identifier extends ASTNode {
  type: 'Identifier'
  name: string
}

export interface Property extends ASTNode {
  type: 'Property'
  kind: 'init' | 'get' | 'set'
  method: boolean
  computed: boolean
  shorthand: boolean
  key: Literal | Identifier
  value: ASTNode
}

export interface ObjectExpression extends ASTNode {
  type: 'ObjectExpression'
  properties: Property[]
}

export interface ArrayExpression extends ASTNode {
  type: 'ArrayExpression'
  elements: ASTNode[]
}
