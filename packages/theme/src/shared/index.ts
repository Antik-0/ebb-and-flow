import type { ThemeConfig } from '#/types'
import { useData, withBase } from 'vitepress'

const HASH_OR_QUERY_RE = /[?#].*$/
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/
const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i

export function isExternalLink(url: string) {
  return EXTERNAL_URL_RE.test(url)
}

export function normalizeLink(href: string) {
  if (isExternalLink(href)) {
    return href
  }
  return withBase(href)
}

export function normalize(path: string): string {
  return decodeURI(path)
    .replace(HASH_OR_QUERY_RE, '')
    .replace(INDEX_OR_EXT_RE, '$1')
}

export function useThemeConfig() {
  const { theme: themeConfig } = useData<ThemeConfig>()
  return themeConfig
}

export function parseImageURL(url: string) {
  if (url.startsWith('/')) {
    return withBase(url)
  }
  return url
}
