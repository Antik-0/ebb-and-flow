import { basename, extname, resolve } from 'node:path'
import pc from 'picocolors'
import { EbbAndFlow } from './ebb-and-flow.ts'

const targetDir = './images'
const outputDir = './webp'
const targetPath = Bun.fileURLToPath(new URL(targetDir, import.meta.url))
const outputPath = Bun.fileURLToPath(new URL(outputDir, import.meta.url))

EbbAndFlow()
console.log(`${pc.yellow('🪄  ---------- 图 片 转 换 ---------- 🪄')}\n`)

const glob = new Bun.Glob('*.{jpg,png}')
for await (const file of glob.scan({ cwd: targetPath })) {
  const image = new Bun.Image(resolve(targetPath, file)).webp({ quality: 80 })
  const outputName = `${basename(file, extname(file))}.webp`
  const filepath = resolve(outputPath, outputName)
  await image.write(filepath)
  console.log(pc.cyan(`图片转换成功: ${filepath}`))
}
