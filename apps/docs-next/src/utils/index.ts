import type { CSSProperties, RefObject } from 'react'
import { isFunction } from '@repo/utils'

export type MaybeRefOrGetter<T = any> = T | RefObject<T> | (() => T)

export function isRefObject(value: unknown): value is RefObject<any> {
  return value !== null && typeof value === 'object' && 'current' in value
}

export function toValue<T = any>(source: MaybeRefOrGetter<T>): T {
  if (isFunction(source)) {
    return source()
  }
  return isRefObject(source) ? source.current : source
}

type StyleWithVars = CSSProperties | Record<string, string> | undefined | false

export const withVars = (...styles: StyleWithVars[]) => {
  const style: CSSProperties = {}
  for (const sv of styles) {
    if (sv) {
      Object.assign(style, sv)
    }
  }
  return style
}
