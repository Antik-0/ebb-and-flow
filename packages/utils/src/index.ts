export * from './clsx.ts'
export * from './debounce.ts'
export * from './general.ts'
export * from './groupBy.ts'

const HASH_OR_QUERY_RE = /[?#].*$/
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/
const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i

export function isExternalLink(url: string) {
  return EXTERNAL_URL_RE.test(url)
}

export function normalizeLink(path: string): string {
  return decodeURI(path)
    .replace(HASH_OR_QUERY_RE, '')
    .replace(INDEX_OR_EXT_RE, '$1')
}
