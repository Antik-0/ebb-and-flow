export * from './lodash'

export const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

export const sleep = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time))
