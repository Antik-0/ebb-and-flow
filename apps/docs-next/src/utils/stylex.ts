import type { CSSProperties } from 'react'

type Falsy = false | null | undefined

type StyleValue =
  | CSSProperties
  | Record<string, string | number | Falsy>
  | Falsy

export function stylex(...styles: StyleValue[]) {
  const res: Record<string, any> = {}
  for (const style of styles) {
    if (!style) continue

    for (const key in style) {
      const value = style[key as keyof typeof style]
      if (value === 0 || value) {
        res[key] = value
      }
    }
  }
  return res as CSSProperties
}
