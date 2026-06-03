/**
 *   ~~~~·...·~~·...·~~~~              ~~~~·...·~~·...·~~~~
 *        ~~~~..~~~~      Ebb-and-Flow      ~~~~..~~~~
 *          ~~..~~                            ~~..~~
 *         ..·~~·..    潮汐往复, 流动不息       ..·~~·..
 *      ~~~~      ~~~~                    ~~~~      ~~~~
 */

import pc from 'picocolors'

const waves = [
  '~~~~·...·~~·...·~~~~',
  '     ~~~~..~~~~',
  '       ~~..~~',
  '      ..·~~·..',
  '   ~~~~      ~~~~'
]
const wavesSize = waves.map(w => w.length * 2)
const author = 'Ebb-anf-Flow'
const slogan = '潮汐往复, 流动不息'

export function EbbAndFlow() {
  const textWidth = Bun.stringWidth(slogan)
  const lineWidth = Math.max(textWidth + 4, 30) + wavesSize[3]!

  let n = 0
  const stdout: string[] = []

  n = lineWidth - wavesSize[0]!
  stdout.push(waves[0] + blank(n) + waves[0])

  n = lineWidth - wavesSize[1]!
  stdout.push(waves[1]! + pc.white(textCenter(author, n)) + reverse(waves[1]!))

  n = lineWidth - wavesSize[2]!
  stdout.push(waves[2]! + blank(n) + reverse(waves[2]!))

  n = lineWidth - wavesSize[3]!
  stdout.push(waves[3]! + textCenter(slogan, n) + reverse(waves[3]!))

  n = lineWidth - wavesSize[4]!
  stdout.push(waves[4]! + blank(n) + reverse(waves[4]!))

  console.log(
    '\n' + pc.cyan(stdout.map(s => ' '.repeat(4) + s).join('\n')) + '\n'
  )
}

function blank(n: number) {
  return ' '.repeat(n)
}

function reverse(s: string) {
  return [...s].toReversed().join('')
}

function textCenter(text: string, length: number) {
  const w = Bun.stringWidth(text)
  const b = Math.ceil((length - w) / 2)
  return blank(b) + text + blank(b)
}
