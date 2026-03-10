import type { Frontmatter } from '../types/index.ts'

/**
 * ✨ `frontmatter` 语法解析
 */
export function parseFrontmatter(template: string) {
  template = template.replaceAll('\r\n', '\n')
  const items = template.split('\n')

  const frontmatter: Frontmatter = {}
  const keyPaths: (string | number)[] = []
  let levelIndex = 0

  function setProp(
    paths: (string | number)[],
    key: string | number,
    value: unknown
  ) {
    let target = frontmatter
    for (const path of paths) {
      target = target[path]
    }
    Reflect.set(target, key, value)
  }

  for (const item of items) {
    if (!item) continue

    const prop = resolveProp(item)
    if (prop === null) continue

    const { key, value, level, isArray } = prop
    const keyLevel = level + 1
    const keyLength = keyPaths.length

    if (keyLevel > keyLength) {
      levelIndex = 0
      const parentPath = keyPaths.slice(0, -1)
      const parentKey = keyPaths.at(-1) ?? key
      setProp(parentPath, parentKey, isArray ? [] : {})
    } else if (keyLevel < keyLength) {
      levelIndex = 0
      keyPaths.length = level
    } else {
      levelIndex += 1
      keyPaths.length = level
    }

    const propKey = key || levelIndex
    setProp(keyPaths, propKey, value)
    keyPaths.push(propKey)
  }

  return frontmatter
}

const shouldParseReg =
  /^(?:true|false|null|undefined|-?\d+(?:\.\d+)?|\{.*\}|\[.*\])/

function resolveProp(str: string) {
  const prop = {
    key: '',
    value: '',
    level: 0,
    isArray: false
  }
  const length = str.length

  let i = 0
  // 计算缩进等级，2个空格一级
  while (i < length && str[i] === ' ') {
    i += 1
  }
  if (i & 1) {
    // 缩进格式错误
    return null
  }
  prop.level = i / 2

  if (str[i] === '-') {
    // 数组成员
    prop.isArray = true
    prop.value = str.slice(i + 1)
  } else {
    // key: value 形式
    let j = i
    while (j < length && str[j] !== ':') {
      j += 1
    }
    prop.key = str.slice(i, j)
    prop.value = str.slice(j + 1)
  }

  prop.key = prop.key.trim()
  prop.value = prop.value.trim()

  if (shouldParseReg.test(prop.value)) {
    prop.value = JSON.parse(prop.value)
  }

  return prop
}
