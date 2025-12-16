export { debounce, throttle } from './debounce.ts'
export { groupBy } from './groupBy.ts'

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

/**
 * 睡眠指定时间
 */
export const sleep = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time))

/**
 * 返回指定闭区间的随机整数
 */
export const random = (min: number, max: number) => {
  const n = Math.random() * (max - min + 1) + min
  return Math.floor(n)
}

/**
 * 空函数
 */
export const noop = () => {}

/**
 * 返回指定闭区间数列，若只提供一个参数 n，则返回 [0, n] 数列
 */
export function range(n: number): number[]
export function range(min: number, max: number): number[]
export function range(min: number, max?: number) {
  if (!max) {
    return Array.from({ length: min }).map((_, i) => i)
  }
  if (min > max) return []
  const length = max - min + 1
  return Array.from({ length }).map((_, i) => min + i)
}

/**
 * 尝试在线程空闲的时候运行回调
 */
export function tryOnIdle(callback: () => void) {
  const idle = window.requestIdleCallback
  if (typeof idle === 'function') {
    window.requestIdleCallback(callback, { timeout: 2000 })
  } else {
    window.requestAnimationFrame(callback)
  }
}

/**
 * 等待下一个动画帧或者指定动画帧
 */
export function nextAnimationFrame(n = 1) {
  return new Promise(resolve => {
    const step = () =>
      --n === 0 ? resolve(true) : window.requestAnimationFrame(step)
    window.requestAnimationFrame(step)
  })
}
