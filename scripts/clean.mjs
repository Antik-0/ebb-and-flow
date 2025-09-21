import { log } from 'node:console'
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import ora from 'ora'
import pc from 'picocolors'
import prompts from 'prompts'

const cleanFiles = [
  '.temp',
  '.turbo',
  'cache',
  'dist',
  'node_modules',
  'pnpm-lock.yaml'
]
const ignoreFiles = ['.git', '.github', '.vscode', 'assets', 'src']
const recursiveDepth = 4

try {
  log(`\n🧹${pc.yellow('---------- 清 理 脚 本 ----------')}🧹\n\n`)

  const response = await prompts(
    [
      {
        type: 'multiselect',
        name: 'files',
        hint: '(👆 👇 切换, 👈 👉 选择, a 全选, 回车确认)\n',
        message: pc.red('请选择要清理的路径: '),
        instructions: false,
        choices: cleanFiles.map(path => ({
          title: path,
          value: path,
          selected: true
        }))
      },
      {
        type: 'confirm',
        name: 'recursive',
        message: pc.red('是否递归删除?'),
        initial: true
      }
    ],
    {
      onCancel: () => Promise.reject(false)
    }
  )

  const rootPath = fileURLToPath(new URL('../', import.meta.url))
  const cleanSet = new Set(response.files)
  const spinner = ora({ indent: 2 })
  const depth = response.recursive ? recursiveDepth : 1

  log('\n')
  await cleanupRecursive(rootPath, cleanSet, spinner, depth)
  spinner.stop()

  log(`\n🧹${pc.green('---------- 清 理 完 成 ----------')}🧹\n\n`)
} catch {
  log(`\n🧹${pc.red('---------- 清 理 取 消 ----------')}🧹\n\n`)
}

async function cleanupRecursive(root, cleanSet, spinner, depth = 1) {
  if (depth === 0 || cleanSet.size === 0) return

  spinner.start('Loading...')

  const subDirs = []
  const dir = await fs.opendir(root)
  for await (const dirent of dir) {
    const path = resolve(root, dirent.name)

    if (cleanSet.has(dirent.name)) {
      try {
        spinner.start(`正在清理 => ${path}`)
        await fs.rm(path, { force: true, recursive: true })
        spinner.succeed(pc.green(`清理成功 => ${path}`))
      } catch {
        spinner.fail(pc.red(`清理失败 => ${path}`))
      }
      continue
    }

    if (dirent.isDirectory() && !ignoreFiles.includes(dirent.name)) {
      subDirs.push(path)
    }
  }

  for (const dir of subDirs) {
    await cleanupRecursive(dir, cleanSet, spinner, depth - 1)
  }
}
