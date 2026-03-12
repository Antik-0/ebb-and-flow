import pc from 'picocolors'

const logStart = () => {
  console.log(`\n${pc.yellow('🕔 markdown start compiling ...')}\n`)
}

const logSuccessd = (total: number, duration: number) => {
  console.log(`
      \n${
        pc.yellow('🎉 markdown compile successd ') +
        pc.red(`in ${duration.toFixed(2)} ms `) +
        pc.gray(`with ${total} files`)
      }\n
    `)
}

const logCompiled = (path: string, duration: number) => {
  console.log(
    pc.magenta(`✨ ${path.padEnd(50, ' ')} `) +
      pc.blue('compiled in ') +
      pc.red(`${duration.toFixed(2).padStart(8)} ms`)
  )
}

const logCached = (path: string) => {
  console.log(pc.magenta(`⚡ ${path.padEnd(50, ' ')} `) + pc.blue('cached'))
}

export const logger = {
  start: logStart,
  cached: logCached,
  successd: logSuccessd,
  compiled: logCompiled
}
