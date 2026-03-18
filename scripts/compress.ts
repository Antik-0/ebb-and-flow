import { resolve } from 'node:path'
import { brotliCompressSync, constants } from 'node:zlib'
import pc from 'picocolors'

const root = process.cwd()
const output = 'apps/docs/.output/public/_nuxt'
const dist = resolve(root, output)
const params = { [constants.BROTLI_PARAM_QUALITY]: 10 }

console.log(`\n✨ ${pc.yellow('compress ...')} ✨\n`)

const glob = new Bun.Glob('*.{js,css}')
for await (const filename of glob.scan({ cwd: dist })) {
  const filepath = resolve(dist, filename)
  const file = Bun.file(filepath)
  const stat = await file.stat()
  if (stat.size < 1000) {
    continue
  }

  const buffer = await file.arrayBuffer()
  const content = brotliCompressSync(buffer, { params })

  const outputFile = Bun.file(resolve(output, filename + '.br'))
  await outputFile.write(content)

  console.log(
    pc.blue(`${output}/${filename}`.padEnd(60, ' ')) +
      pc.gray(' compress to ') +
      pc.cyan(`${tokB(content.byteLength)}`) +
      pc.green(`(${tokB(buffer.byteLength)})`)
  )
}

console.log(`\n🎉 ${pc.green('compress done!')} 🎉\n`)

function tokB(size: number) {
  return (size / 1000).toFixed(2) + 'kB'
}
