import { resolve } from 'node:path'
import pc from 'picocolors'

const cwd = resolve(import.meta.dir, '..')
const env = {
  ...process.env,
  FORCE_COLOR: '1'
}

function run(cmds: string[], stdout: 'pipe' | 'inherit') {
  return Bun.spawn(cmds, { cwd, env, stdout, stderr: 'inherit' })
}

const server = run(['bun', 'run', 'db:start'], 'pipe')

const decode = new TextDecoder()
for await (const message of server.stdout!) {
  const text = decode.decode(message)
  console.log(text)
  if (text.includes('ok')) {
    break
  }
}
server.stdout!.cancel()

const build = run(['bun', 'run', 'build:nuxt'], 'inherit')
await build.exited

const compress = run(['bun', 'run', 'compress'], 'inherit')
await compress.exited

server.kill('SIGTERM')
await server.exited

console.log(pc.red('构建结束'))
