export type * as HAST from 'hast'
export type * as MDAST from 'mdast'

export interface Metadata {
  /**
   * 文章标题
   */
  title: string
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
  to: string
  text: string
  level: number
}

/**
 * esTree Descriptor Syntax
 *
 * refer: https://github.com/estree/estree/blob/master/es5.md
 */

export interface EsNode {
  type: string
}

export interface Program extends EsNode {
  type: 'Program'
  body: Statement[]
}

export interface Statement extends EsNode {}

export interface ExpressionStatement extends Statement {
  type: 'ExpressionStatement'
  expression: Expression
}

export interface Expression extends EsNode {}

export type LiteralValue = string | number | boolean | null

export interface Literal extends EsNode {
  type: 'Literal'
  value: LiteralValue
}

export interface Identifier extends EsNode {
  type: 'Identifier'
  name: string
}

export interface Property extends EsNode {
  type: 'Property'
  kind: 'init' | 'get' | 'set'
  method: boolean
  computed: boolean
  shorthand: boolean
  key: Literal | Identifier
  value: EsNode
}

export interface ObjectExpression extends Expression {
  type: 'ObjectExpression'
  properties: Property[]
}

export interface ArrayExpression extends Expression {
  type: 'ArrayExpression'
  elements: EsNode[]
}
