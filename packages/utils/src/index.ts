export * from './lodash.ts'

/**
 * 判断是否支持 ViewTranstion API
 */
export const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

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
