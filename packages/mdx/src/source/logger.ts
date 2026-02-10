import pc from 'picocolors'

export const logStart = () => {
  console.log(`\n${pc.yellow('🕔 mdx start compiling ...')}\n`)
}

export const logEnd = (duration: number) => {
  console.log(`
      \n${
        pc.yellow('🎉 mdx compile successd ') +
        pc.gray(`in ${duration.toFixed(2)}ms`)
      }\n
    `)
}

export const logCompiled = (path: string, duration: number) => {
  console.log(
    pc.magenta(`✨ ${path.padEnd(50, ' ')} `) +
      pc.blue('compiled in ') +
      pc.red(`${duration.toFixed(2).padStart(6)} ms`)
  )
}

export const logCached = (path: string) => {
  console.log(pc.magenta(`⚡ ${path.padEnd(50, ' ')} `) + pc.blue('cached'))
}
