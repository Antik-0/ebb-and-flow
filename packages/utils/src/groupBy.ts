/**
 * 数组分组
 */
export function groupBy<T = any>(
  collection: T[],
  keyFn: (value: T, index: number) => string
) {
  const result: Record<string, T[]> = Object.create(null)

  for (const [index, item] of collection.entries()) {
    const key = keyFn(item, index)
    const groups = result[key] ?? (result[key] = [])
    groups.push(item)
  }

  return result
}
