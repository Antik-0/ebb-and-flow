import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import ora from 'ora'
import pc from 'picocolors'
// @ts-expect-error: no types
import prompts from 'prompts'

const cleanFiles = [
  'node_modules',
  'bun.lock',
  'cache',
  'dist',
  '.nuxt',
  '.nitro',
  '.data',
  '.output',
  '.next',
  '.temp',
  '.turbo'
]
const ignoreFiles = ['.git', '.github', '.vscode', 'assets', 'src']
const recursiveDepth = 4
const spinner = ora({ indent: 2 })

try {
  console.log(`\n\n🧹${pc.yellow('---------- 清 理 脚 本 ----------')}🧹\n\n`)

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
  const cleanSet = new Set<string>(response.files)
  const depth = response.recursive ? recursiveDepth : 1

  console.log('\n')
  await cleanupRecursive(rootPath, cleanSet, depth)

  console.log(`\n\n🧹${pc.green('---------- 清 理 完 成 ----------')}🧹\n\n`)
} catch {
  console.log(`\n\n🧹${pc.red('---------- 清 理 取 消 ----------')}🧹\n\n`)
} finally {
  spinner.stop()
}

async function cleanupRecursive(
  dirPath: string,
  cleanSet: Set<string>,
  depth = 1
) {
  if (depth === 0 || cleanSet.size === 0) return

  const subDirs = []
  const currDir = await fs.opendir(dirPath)
  for await (const dirent of currDir) {
    const filePath = resolve(dirPath, dirent.name)

    if (cleanSet.has(dirent.name)) {
      try {
        spinner.start(`正在清理 => ${filePath}`)
        await fs.rm(filePath, { force: true, recursive: true })
        spinner.succeed(pc.green(`清理成功 => ${filePath}`))
      } catch {
        spinner.fail(pc.red(`清理失败 => ${filePath}`))
      }
      continue
    }

    if (dirent.isDirectory() && !ignoreFiles.includes(dirent.name)) {
      subDirs.push(filePath)
    }
  }

  for (const dir of subDirs) {
    await cleanupRecursive(dir, cleanSet, depth - 1)
  }
}
