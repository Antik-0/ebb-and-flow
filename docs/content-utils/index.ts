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
    return undefined
  }
}
