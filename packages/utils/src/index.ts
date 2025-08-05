export * from './lodash'

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
