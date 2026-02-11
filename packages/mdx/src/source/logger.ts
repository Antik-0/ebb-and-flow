import pc from 'picocolors'

const logStart = () => {
  console.log(`\n${pc.yellow('🕔 mdx start compiling ...')}\n`)
}

const logSuccessd = (duration: number) => {
  console.log(`
      \n${
        pc.yellow('🎉 mdx compile successd ') +
        pc.gray(`in ${duration.toFixed(2)}ms`)
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
