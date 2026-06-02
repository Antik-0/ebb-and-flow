/**
 *             〰️ 〰️ 〰️  Ebb-and-Flow  〰️ 〰️ 〰️
 *
 *         .·´¯`·.      潮汐往复，流动不息      .·´¯`·.
 *      ~~~        ~~~                 ~~~        ~~~
 */

import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import ora from 'ora'
import pc from 'picocolors'
// @ts-expect-error: no types
import prompts from 'prompts'

const packages = ['apps/*', 'packages/*', 'packages/configs/*']
const effects = [
  'apps/docs/{.nuxt,.nitro,.output}',
  'apps/docs-next/{.next,out}',
  'packages/*/{dist,.turbo}',
  'packages/configs/*/{dist,.turbo}'
]

async function collectCleanupPaths(patterns: string[]) {
  const res: string[] = []
  for (const pattern of patterns) {
    const glob = new Bun.Glob(pattern)
    for await (const file of glob.scan({ onlyFiles: false, dot: true })) {
      res.push(file)
    }
  }
  return res
}

const rootPath = fileURLToPath(new URL('../', import.meta.url))
const spinner = ora({ indent: 2 })

try {
  console.log(`\n\n🧹${pc.yellow('---------- 清 理 脚 本 ----------')}🧹\n\n`)

  const nodeModules = await collectCleanupPaths(
    packages.map(pkg => pkg + '/node_modules')
  )
  const effectsList = await collectCleanupPaths(effects)
  const cleanupList = [
    'node_modules',
    ...nodeModules,
    ...effectsList,
    '.turbo',
    'data/.db'
  ]

  const response = await prompts(
    [
      {
        type: 'confirm',
        name: 'includeLockFile',
        message: pc.red('是否删除 bun.lock 文件?'),
        initial: true
      }
    ],
    {
      onCancel: () => Promise.reject(false)
    }
  )
  if (response.includeLockFile) {
    cleanupList.push('bun.lock')
  }

  console.log('\n')
  for (const path of cleanupList) {
    const filePath = resolve(rootPath, path)
    try {
      spinner.start(`正在清理 => ${path}`)
      await fs.rm(filePath, { force: true, recursive: true })
      spinner.succeed(pc.green(`清理成功 => ${path}`))
    } catch {
      spinner.fail(pc.red(`清理失败 => ${path}`))
    }
  }

  console.log(`\n\n🧹${pc.green('---------- 清 理 完 成 ----------')}🧹\n\n`)
} catch {
  console.log(`\n\n🧹${pc.red('---------- 清 理 取 消 ----------')}🧹\n\n`)
} finally {
  spinner.stop()
}
