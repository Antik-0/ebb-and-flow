export * from './clsx.ts'
export * from './datetime.ts'
export * from './debounce.ts'
export * from './general.ts'

export function isExternalLink(url: string) {
  return url.startsWith('http')
}
