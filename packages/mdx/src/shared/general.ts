import { execSync } from 'node:child_process'

/**
 * 计算文章阅读时间
 */
export function computeReadingTime(content: string) {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * 获取文章 git 最后提交时间
 */
export function getGitUpdatedTime(filepath: string) {
  try {
    const time = execSync(
      `git log -1 --pretty=format:%ct -- ${filepath}`
    ).toString()
    return Number(time) * 1000
  } catch {
    return null
  }
}

/**
 * CSS 选择器消毒
 */
export function sanitizeSelector(str: string) {
  return (
    str
      .trim() // 去掉首尾空格
      // 匹配所有非法 CSS 标识符字符
      .replaceAll(
        /[^a-zA-Z0-9\u4e00-\u9fa5_-]+/g,
        '-' // 替换成 -
      )
      // 合并连续的 -
      .replaceAll(/-+/g, '-')
      // 去掉开头或结尾的 -
      .replaceAll(/^-|-$/g, '')
  )
}
