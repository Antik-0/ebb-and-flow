import { basename, extname, resolve } from 'node:path'

const targetDir = './images'
const outputDir = './webp'
const targetPath = Bun.fileURLToPath(new URL(targetDir, import.meta.url))
const outputPath = Bun.fileURLToPath(new URL(outputDir, import.meta.url))

const glob = new Bun.Glob('*.{jpg,png}')
for await (const file of glob.scan({ cwd: targetPath })) {
  const image = new Bun.Image(resolve(targetPath, file)).webp({ quality: 80 })
  const outputName = `${basename(file, extname(file))}.webp`
  await image.write(resolve(outputPath, outputName))
}
