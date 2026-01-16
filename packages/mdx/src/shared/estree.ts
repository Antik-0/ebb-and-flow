import type {
  ArrayExpression,
  EsNode,
  ExpressionStatement,
  Literal,
  LiteralValue,
  ObjectExpression,
  PlainObject,
  Program,
  Property
} from '../types.ts'

export function createEsTree(value: unknown): Program {
  return {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: createExpression(value)
      } as ExpressionStatement
    ]
  }
}

export function createExpression(value: unknown): EsNode | null {
  if (isLiteral(value)) {
    return toLiteralNode(value)
  }

  if (isArray(value)) {
    const elements: EsNode[] = []
    for (const v of value) {
      const ele = createExpression(v)
      if (ele !== null) {
        elements.push(ele)
      }
    }
    return toArrayNode(elements)
  }

  if (isObject(value)) {
    const properties: Property[] = []
    for (const k in value) {
      const v = createExpression(value[k])
      if (v !== null) {
        properties.push(toPropertyNode(k, v))
      }
    }
    return toObjectNode(properties)
  }

  return null
}

const isArray = (value: unknown) => Array.isArray(value)

const isObject = (value: unknown): value is PlainObject =>
  Object.prototype.toString.call(value) === '[object Object]'

const isLiteral = (value: unknown): value is LiteralValue => {
  const type = typeof value
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'boolean' ||
    value === null
  )
}

function toLiteralNode(value: LiteralValue): Literal {
  return { type: 'Literal', value }
}

function toArrayNode(elements: EsNode[]): ArrayExpression {
  return { type: 'ArrayExpression', elements }
}

function toObjectNode(properties: Property[]): ObjectExpression {
  return { type: 'ObjectExpression', properties }
}

function toPropertyNode(key: string, value: EsNode): Property {
  return {
    type: 'Property',
    kind: 'init',
    method: false,
    computed: false,
    shorthand: false,
    key: { type: 'Identifier', name: key },
    value
  }
}
