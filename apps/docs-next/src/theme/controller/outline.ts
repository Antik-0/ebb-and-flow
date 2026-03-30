import type { TocItem } from '../types'
import { useEffect } from 'react'
import { useIntersectionObserver } from '../hooks'
import { defineEbbStore } from '../store'
import { uesPage } from './layout'

export const [useTocActive, tocActiveStore] = defineEbbStore<{
  start: number
  end: number
}>(() => {
  return { start: -1, end: -1 }
})

let activeState: number[] = []
export function useOutline() {
  const toc = uesPage(state => state.toc ?? [])

  const { observe, clear } = useIntersectionObserver()

  function observeHeading() {
    const size = toc.length
    activeState = Array.from<number>({ length: size }).fill(0)

    for (const item of toc) {
      const target = document.getElementById(item.id)
      if (target) {
        observe(target, entry => {
          const index = Number(entry.target.getAttribute('data-index'))
          const isAcitve = entry.isIntersecting
          activeState[index] = isAcitve ? 1 : 0

          const start = activeState.indexOf(1)
          const end = activeState.lastIndexOf(1)
          if (end === -1) {
            tocActiveStore.setState(state => ({ end: state.start - 1 }))
          } else {
            tocActiveStore.setState({ start, end })
          }
        })
      }
    }
  }

  function clearObserver() {
    clear()
    activeState.length = 0
    tocActiveStore.reset()
  }

  useEffect(() => {
    observeHeading()
    return clearObserver
  }, [toc])

  return { toc }
}

export function createSVGMask(toc: TocItem[]) {
  // toc-item: line-height: 24, padding-block: 4
  const ox = 4 // x 起点
  const xStep = 16 // x 步长
  const yStep = 24 // y 步长，对应文本的行高
  const pad = 4 // padding-top
  const gap = 8 // double padding-top

  let maxLv = 0
  let [x, y] = [ox, -pad]
  const paths = [`M ${ox},4`]

  for (const item of toc) {
    const lv = item.level - 2
    maxLv = Math.max(maxLv, lv)
    const nx = ox + lv * xStep
    if (nx !== x) {
      paths.push(`L ${x},${y}`)
      x = nx
      y += gap
      paths.push(`L ${x},${y}`)
      y += yStep
    } else {
      y += yStep + gap
    }
  }
  paths.push(`L ${x},${y}`)

  const width = maxLv * xStep + ox * 2
  const height = toc.length * (yStep + gap)
  const path = paths.join(' ')

  const template = maskSvgTemplate(width, height, path)
  const maskURL = `data:image/svg+xml,${template}`

  return { width, height, path, maskURL }
}

function maskSvgTemplate(width: number, height: number, path: string) {
  const template = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${width} ${height}"
      height="${height}"
      width="${width}"
    >
      <path d="${path}" fill="none" stroke="currentColor" stroke-width="1" />
    </svg>
  `
  return template
    .trim()
    .replaceAll(/\r?\n/g, '')
    .replaceAll(/\s+/g, ' ')
    .replaceAll(/([">])\s+/g, '$1%20')
}
