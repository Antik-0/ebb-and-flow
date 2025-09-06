import { log } from 'node:console'
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import ora from 'ora'
import pc from 'picocolors'
import prompts from 'prompts'

const cleanPaths = ['.temp', '.turbo', 'node_modules', 'pnpm-lock.yaml']
const rootPath = fileURLToPath(new URL('../', import.meta.url))

try {
  log(`\n🧹${pc.yellow('---------- 清 理 脚 本 ----------')}🧹\n\n`)

  const response = await prompts([
    {
      type: 'multiselect',
      name: 'paths',
      hint: '(👆 👇 切换, 👈 👉 选择, a 全选, 回车确认)\n',
      message: pc.red('请选择要清理的路径: '),
      instructions: false,
      choices: cleanPaths.map(path => ({
        title: path,
        value: path,
        selected: true
      }))
    }
  ])

  log('\n')
  const spinner = ora({ indent: 2 })
  for (const path of response.paths) {
    try {
      spinner.text = `正在清理 => ${path}`
      spinner.start()

      await fs.rm(resolve(rootPath, path), { force: true, recursive: true })

      spinner.succeed(pc.green(`清理成功 => ${path}`))
    } catch {
      spinner.fail(pc.red(`清理失败 => ${path}`))
    }
  }
  spinner.stop()

  log(`\n🧹${pc.green('---------- 清 理 完 成 ----------')}🧹\n\n`)
} catch {
  log(`\n🧹${pc.red('---------- 清 理 取 消 ----------')}🧹\n\n`)
}
