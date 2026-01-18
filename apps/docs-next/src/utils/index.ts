import type { RefObject } from 'react'
import { isFunction } from '@repo/utils'
import { themeConfig } from '#/theme.config'

export { stylex } from './stylex'

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

export function formatTitle(title?: string, template?: string) {
  if (!title) {
    return themeConfig.title
  }

  const titleTemplate = template ?? themeConfig.titleTemplate
  if (!titleTemplate) {
    return title
  }

  return titleTemplate.replaceAll('<title>', title)
}
