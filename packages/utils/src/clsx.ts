import { isArray, isPlainObject, isString } from './general.ts'

type ClassObject = Record<string, number | boolean | null | undefined>

type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassObject
  | ClassValue[]

export function clsx(...inputs: ClassValue[]) {
  let res = ''
  for (const klass of inputs) {
    const v = normalizeClass(klass)
    if (v) res += v + ' '
  }
  return res.trim()
}

function normalizeClass(klass: ClassValue) {
  if (!klass) return ''
  if (isString(klass)) return klass

  let res = ''
  if (isPlainObject(klass)) {
    for (const name in klass) {
      if ((klass as any)[name]) {
        res += name + ' '
      }
    }
  } else if (isArray(klass)) {
    for (const k of klass) {
      res += normalizeClass(k) + ' '
    }
  }
  return res.trim()
}
