import { random, range } from '@repo/utils'
import { onWindowResize } from '../observer'

type RangeNumber = [number, number]

interface MeteorConfig {
  /**
   * 流星出现的范围
   */
  startXRange: RangeNumber
  startYRange: RangeNumber
  /**
   * 流星消失的Y轴范围
   */
  endYRange: RangeNumber
  /**
   * 流星划入角度 - [0, PI/2]
   */
  angle: number
  /**
   * 流星长度
   */
  length: RangeNumber
  /**
   * 流星速度
   */
  velocityRange: RangeNumber
  /**
   * 首次出现的流星数量
   */
  initCount: RangeNumber
  /**
   * 生成间隔(ms)
   */
  interval: number
  /**
   * 每次生成的数量
   */
  yieldCount: RangeNumber
}

const meteorConfig: MeteorConfig = {
  startXRange: [0.2, 1.4],
  startYRange: [0, 0.2],
  endYRange: [0.4, 0.7],
  angle: Math.PI / 4,
  length: [200, 240],
  velocityRange: [6, 12],
  initCount: [1, 2],
  interval: 1000,
  yieldCount: [1, 1]
}

const MeteorState = {
  Active: 'Active',
  Fading: 'Fading',
  Inactive: 'Inactive'
} as const

type MeteorState = keyof typeof MeteorState

class Meteor {
  public x: number
  public y: number
  public fadeX: number | undefined
  public fadeY: number | undefined
  public vx: number
  public vy: number
  public angle: number
  public length: number
  public visibleLength: number
  public state: MeteorState

  constructor() {
    const { angle, length, velocityRange, endYRange } = meteorConfig

    const [startX, startY] = generateMeteorStartPoint()
    this.x = startX
    this.y = startY
    const h = canvas!.height
    this.fadeY = random(h * endYRange[0], h * endYRange[1])

    const velocity = random(...velocityRange)
    this.vx = velocity * Math.cos(angle) * -1
    this.vy = velocity * Math.sin(angle)
    this.angle = angle
    this.length = random(...length)
    this.visibleLength = this.length

    this.state = MeteorState.Active
  }

  public computeMeteorProps() {
    const { x, y, angle } = this

    let [offsetX, offsetY] = [x, y]
    let [colorX, colorY] = [0, 0]
    if (this.state === MeteorState.Fading) {
      const fadeX = this.fadeX!
      const fadeY = this.fadeY!
      ;[offsetX, offsetY] = [fadeX, fadeY]
      ;[colorX, colorY] = [fadeX - x, y - fadeY]
      const fadedLength = Math.sqrt((fadeX - x) ** 2 + (y - fadeY) ** 2)
      this.visibleLength = this.length - fadedLength
    }
    const tailX = this.visibleLength * Math.cos(angle)
    const tailY = this.visibleLength * Math.sin(angle) * -1

    const color = canvasCtx.createLinearGradient(colorX, colorY, tailX, tailY)
    color.addColorStop(0, 'hsl(0 0% 80% / 0.8)')
    color.addColorStop(0.6, 'hsl(0 0% 40% / 0.4)')
    color.addColorStop(1, 'transparent')

    return { offsetX, offsetY, tailX, tailY, color }
  }

  public animate(ctx: CanvasRenderingContext2D) {
    if (this.state === MeteorState.Inactive) {
      return
    }

    if (this.y >= this.fadeY! && !this.fadeX) {
      this.fadeX = this.x
      this.state = MeteorState.Fading
    }

    this.x += this.vx
    this.y += this.vy

    const { offsetX, offsetY, tailX, tailY, color } = this.computeMeteorProps()

    if (this.visibleLength <= 0) {
      this.state = MeteorState.Inactive
      return
    }

    ctx.save()
    ctx.translate(offsetX, offsetY)
    ctx.strokeStyle = color
    ctx.lineCap = 'round'
    ctx.lineWidth = 2
    ctx.filter = 'drop-shadow(0 0 20px #95e3f7)'

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(tailX, tailY)
    ctx.stroke()

    ctx.restore()
  }
}

function generateMeteorStartPoint(): [number, number] {
  const { startXRange, startYRange } = meteorConfig
  const w = canvas!.width
  const h = canvas!.height

  let [x, y] = [random(w * startXRange[0], w * startXRange[1]), 0]
  if (x >= w) {
    x = w
    y = random(h * startYRange[0], h * startYRange[1])
  }

  return [x, y]
}

let canvas: HTMLCanvasElement | null = null
let canvasCtx: CanvasRenderingContext2D = undefined!
let lastCreateTime: DOMHighResTimeStamp | undefined
let cancled = false

const meteorList: Set<Meteor> = new Set()
const waitingClearList: Meteor[] = []

function generateMeteors(n: number) {
  for (const _ of range(n)) {
    meteorList.add(new Meteor())
  }
}

function clearMeteors(meteor: Meteor) {
  waitingClearList.push(meteor)
  if (waitingClearList.length === 1) {
    queueMicrotask(() => {
      for (const meteor of waitingClearList) {
        meteorList.delete(meteor)
      }
      waitingClearList.length = 0
    })
  }
}

function animate(timestamp: DOMHighResTimeStamp) {
  if (cancled) {
    return
  }

  if (!lastCreateTime) {
    generateMeteors(random(...meteorConfig.initCount))
    lastCreateTime = timestamp
  }

  if (timestamp - lastCreateTime >= meteorConfig.interval) {
    generateMeteors(random(...meteorConfig.yieldCount))
    lastCreateTime = timestamp
  }

  canvasCtx.clearRect(0, 0, canvas!.width, canvas!.height)
  for (const meteor of meteorList.values()) {
    if (meteor.state === MeteorState.Inactive) {
      clearMeteors(meteor)
    } else {
      meteor.animate(canvasCtx)
    }
  }

  requestAnimationFrame(animate)
}

interface MeteorAnimationOptions {
  style: (CSSStyle: CSSStyleDeclaration) => void
}

export function meteorAnimation(options: MeteorAnimationOptions) {
  const { style: setStyle } = options

  let cleanupResizeCallback: (() => void) | null = null

  const run = () => {
    if (canvas !== null) {
      return
    }
    cancled = false

    canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    setStyle(canvas.style)
    document.body.append(canvas)

    canvasCtx = canvas.getContext('2d')!

    queueMicrotask(() => {
      requestAnimationFrame(animate)
      cleanupResizeCallback = onWindowResize(() => {
        canvas!.width = window.innerWidth
        canvas!.height = window.innerHeight
      })
    })
  }

  const cleanup = () => {
    canvas?.remove()
    canvas = null
    lastCreateTime = undefined
    meteorList.clear()
    waitingClearList.length = 0
    cancled = true
    cleanupResizeCallback?.()
  }

  return { run, cleanup }
}
