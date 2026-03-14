import fs from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import ora from 'ora'
import pc from 'picocolors'
import rootPackageJSON from '../package.json' with { type: 'json' }

const rootPath = fileURLToPath(new URL('../', import.meta.url))
const spinner = ora({ indent: 2 })

try {
  console.log(
    `\n\n🎮${pc.yellow('---------- 依 赖 升 级 脚 本 ----------')}🎮\n\n`
  )

  // 计算 workspaces 下的 package.json 路径
  const workspaces = rootPackageJSON.workspaces.packages
  const pattern = workspaces.map(work => work + '/package.json')
  const packageJSONPaths = await Array.fromAsync(
    fs.glob(pattern, { exclude: ['node_modules/**'] })
  )

  // 更新 root 下的 `package.json`
  spinner.start('正在升级 => ./package.json')
  await updataRootPackageJSON()
  spinner.succeed(pc.green('依赖更新成功 => ./package.json'))

  // 更新 workspances 下的 `package.json`
  for (const path of packageJSONPaths) {
    spinner.start(`正在升级 => ${path}`)
    await updatePackageJSON(path)
    spinner.succeed(pc.green(`依赖更新成功 => ${path}`))
  }

  console.log(
    `\n\n🎮${pc.green('---------- 依 赖 升 级 完 成 ----------')}🎮\n\n`
  )
} catch (error) {
  console.error(error as Error)
  console.log(
    `\n\n🎮${pc.red('---------- 依 赖 升 级 异 常 ----------')}🎮\n\n`
  )
} finally {
  spinner.stop()
}

async function updataRootPackageJSON() {
  const catalog = rootPackageJSON.workspaces.catalog
  await updateDependencies(catalog)
  await updateDependencies(rootPackageJSON.devDependencies)

  const path = join(rootPath, 'package.json')
  const data = stringify(rootPackageJSON as any)
  await fs.writeFile(path, data)
}

async function updatePackageJSON(path: string) {
  const result = await fs.readFile(path, { encoding: 'utf-8' })
  const packageJSON = JSON.parse(result)

  await updateDependencies(packageJSON.dependencies)
  await updateDependencies(packageJSON.devDependencies)

  await fs.writeFile(path, stringify(packageJSON))
}

async function updateDependencies(field?: Record<string, string>) {
  if (!field) return

  const pkgs = Object.keys(field).filter(key => !isSharedDep(field[key]!))
  const task = pkgs.map(pkg => fetchPackageVersion(pkg))
  const result = await Promise.allSettled(task)

  pkgs.forEach((pkg, index) => {
    const entry = result[index]!
    if (entry.status === 'rejected') {
      return
    }
    const version = entry.value
    if (version !== null) {
      const oldVersion = field[pkg]!
      const prefix = mathVersionPrefix(oldVersion)
      field[pkg] = prefix + version
    }
  })
}

async function fetchPackageVersion(pkg?: string) {
  try {
    const result = await fetch(`https://registry.npmjs.org/${pkg}/latest`)
    if (!result.ok) return null
    const data = (await result.json()) as any
    return data?.version as string
  } catch {
    return null
  }
}

function isSharedDep(pkgVersion: string) {
  return pkgVersion.startsWith('workspace') || pkgVersion.startsWith('catalog')
}

function mathVersionPrefix(version: string) {
  return version.match(/^[\^~]/)?.[0] ?? ''
}

function stringify(data: Record<string, string>) {
  return JSON.stringify(data, undefined, 2) + '\n'
}
