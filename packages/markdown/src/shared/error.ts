import type { VFile } from 'vfile'

type Handler<T = any> = (ast: T, vfile: VFile) => any

export function withErrorHandler<T = any>(name: string, handler: Handler<T>) {
  return (ast: T, vfile: VFile) => {
    try {
      return handler(ast, vfile)
    } catch (error) {
      const message = (error as Error).message
      const pluginName = name[0]?.toLocaleUpperCase() + name.slice(1)
      const errorMsg = `[${pluginName} Error]: ${message}. \n    in file ${vfile.path}`
      throw new Error(errorMsg)
    }
  }
}
