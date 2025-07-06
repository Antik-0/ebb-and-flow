import { promises as fs } from 'node:fs'
import { join as pathJoin } from 'node:path'
import { stdin, stdout } from 'node:process'
import { promises as readline } from 'node:readline'
import pc from 'picocolors'

/**
 * 递归查找并删除目标目录
 * @param {string} currentDir - 当前遍历的目录路径
 * @param {string[]} targets - 要删除的目标文件或目录
 */
async function cleanTargetsRecursively(currentDir, targets) {
  const items = await fs.readdir(currentDir)

  for (const item of items) {
    const itemPath = pathJoin(currentDir, item)
    if (targets.includes(item)) {
      await fs.rm(itemPath, { force: true, recursive: true })
      console.log(pc.magenta(`  ✨ Delete ${itemPath}`))
      continue
    }

    const stat = await fs.lstat(itemPath)
    if (stat.isDirectory()) {
      await cleanTargetsRecursively(itemPath, targets)
    }
  }
}

;(async function startCleanup() {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  const res = await rl.question(pc.red('是否确认删除项目依赖及缓存(y/n): '))
  rl.close()
  if (res === 'n') return

  const rootDir = process.cwd()
  const targets = ['node_modules', 'dist', '.turbo']

  const cleanupTargets = [...targets]
  const deleteLockFile = process.argv.includes('--del-lock')
  if (deleteLockFile) {
    cleanupTargets.push('pnpm-lock.yaml')
  }

  console.clear()
  console.log(
    pc.green('🏗️  Starting cleanup of targets:') +
      pc.blue(` [${cleanupTargets.join(', ')}] `) +
      pc.magenta(`from root: ${rootDir}`)
  )

  try {
    await cleanTargetsRecursively(rootDir, cleanupTargets)
    console.log(pc.green('🎉 Cleanup process completed.'))
  } catch (error) {
    console.log(pc.red(`Unexpected error during cleanup: ${error.message}`))
  }
})()
