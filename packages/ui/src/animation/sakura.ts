import { random, randomInt, range } from '@repo/utils'

interface EventData {
  type: 'start' | 'update' | 'stop'
  payload: any
}

self.addEventListener('message', event => {
  const data = event.data as EventData
  const { type, payload } = data
  switch (type) {
    case 'start': {
      start(payload)
      break
    }
    case 'update': {
      update(payload)
      break
    }
    case 'stop': {
      stop()
      break
    }
    default:
      break
  }
})

let canvas: OffscreenCanvas
let canvasCtx: OffscreenCanvasRenderingContext2D
let lastCreateTime: DOMHighResTimeStamp | undefined
let animationFrame: number

let sakuraImageList: ImageBitmap[] = []
const sakuraList: Set<Sakura> = new Set()
const waitingClearList: Sakura[] = []

async function start(payload: {
  canvas: OffscreenCanvas
  sakuraImage: ImageBitmap
}) {
  canvas = payload.canvas
  canvasCtx = canvas.getContext('2d')!

  const sakuraImage = await loadSakuraImage()
  sakuraImageList = await createSakuraImageList(sakuraImage)
  animationFrame = self.requestAnimationFrame(animate)
}

function update(payload: { width: number; height: number }) {
  const { width, height } = payload
  canvas.width = width
  canvas.height = height
}

function stop() {
  self.cancelAnimationFrame(animationFrame)
}

async function loadSakuraImage() {
  const source = await fetch('/sakura.png').then(res => res.blob())
  const sakuraImage = await self.createImageBitmap(source)
  return sakuraImage
}

async function createSakuraImageList(sakuraImage: ImageBitmap) {
  const [width, height] = SakuraConfig.size

  const createImage = (level: number) => {
    const w = width * level
    const h = height * level

    const canvas = new OffscreenCanvas(w, h)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(sakuraImage, 0, 0, w, h)

    return canvas.transferToImageBitmap()
  }

  return SakuraConfig.scaleLevels.map(createImage)
}

function animate(timestamp: DOMHighResTimeStamp) {
  if (!lastCreateTime) {
    const n = randomInt(...SakuraConfig.initCount)
    generateSakuras(n)
    lastCreateTime = timestamp
  }

  if (timestamp - lastCreateTime >= SakuraConfig.interval) {
    const n = randomInt(...SakuraConfig.yieldCount)
    generateSakuras(n)
    lastCreateTime = timestamp
  }

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

  for (const sakura of sakuraList.values()) {
    if (sakura.active) {
      sakura.animate(canvasCtx)
    } else {
      clearSakura(sakura)
    }
  }

  animationFrame = self.requestAnimationFrame(animate)
}

function generateSakuras(n: number) {
  for (const _ of range(n)) {
    sakuraList.add(new Sakura())
  }
}

function clearSakura(sakura: Sakura) {
  waitingClearList.push(sakura)
  if (waitingClearList.length === 1) {
    queueMicrotask(() => {
      for (const sakura of waitingClearList) {
        sakuraList.delete(sakura)
      }
      waitingClearList.length = 0
    })
  }
}

type RangeNumber = [number, number]

interface SakuraConfig {
  /**
   * 首次出现的数量
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
  /**
   * 樱花粒子大小
   */
  size: [number, number]
  /**
   * 樱花粒子尺寸
   */
  scaleLevels: number[]
}

const SakuraConfig: SakuraConfig = {
  initCount: [2, 6],
  interval: 2000,
  yieldCount: [1, 3],
  size: [24, 24],
  scaleLevels: [0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2]
}

class Sakura {
  /**
   * 控制状态
   */
  public x: number
  public y: number
  public a: number
  public b: number
  public amplitude: number
  public frequency: number
  public phase: number
  public speed: number // 飘落速度
  public angle: number // 旋转角度
  public rotateSpeed: number // 旋转的变化速度
  /**
   * 边界
   */
  public edgeX: number
  public edgeY: number
  /**
   * 樱花是否可见
   */
  public active: boolean
  /**
   * 图片源
   */
  #source: ImageBitmap

  constructor() {
    const length = sakuraImageList.length
    const scaleIndex = randomInt(0, length - 1)
    this.#source = sakuraImageList[scaleIndex]!

    const ch = canvas.height
    this.edgeX = -60
    this.edgeY = ch + 60

    const state = generateSakuraTrajectory()
    this.x = state.x
    this.y = state.y
    this.a = state.a
    this.b = state.b
    this.amplitude = state.amplitude
    this.frequency = state.frequency
    this.phase = state.phase

    this.speed = 1 * SakuraConfig.scaleLevels[scaleIndex]!
    this.angle = Math.floor(Math.random() * Math.PI * 2)
    this.rotateSpeed = (Math.random() - 0.5) * 0.1

    this.active = true
  }

  /**
   * 判断樱花是否落入屏幕外，飘落轨迹是从右上角到左下角
   */
  public isOffcanvas() {
    return this.x <= this.edgeX || this.y >= this.edgeY
  }

  /**
   * 计算运动轨迹
   */
  public computeMotionY(x: number) {
    // 运动轨迹方程: y = ax + b + Asim(cx + d)
    const { a, b, amplitude, frequency, phase } = this
    return a * x + b + amplitude * Math.sin(frequency * x + phase)
  }

  /**
   * 樱花飘落动画
   */
  public animate(ctx: OffscreenCanvasRenderingContext2D) {
    this.x -= this.speed
    this.y = this.computeMotionY(this.x)

    if (this.isOffcanvas()) {
      this.active = false
      return
    }

    this.angle += this.rotateSpeed
    const width = this.#source.width
    const height = this.#source.height

    ctx.save()

    // 将画布移动樱花轨迹点
    ctx.translate(this.x, this.y)
    // 旋转画布
    ctx.rotate(this.angle)
    // 以当前轨迹点为原点，绘制樱花
    ctx.drawImage(this.#source, -(width / 2), -(height / 2))

    ctx.restore()
  }
}

function generateSakuraTrajectory() {
  const w = canvas.width
  const h = canvas.height

  const x1 = random(0.5, 1.2) * w
  const x2 = random(-0.2, 0.4) * w
  const y1 = 0
  const y2 = h

  const a = (y2 - y1) / (x2 - x1)
  const b = -(a * x1)

  // sin 振荡参数
  const amplitude = random(10, 40)
  const frequency = random(0.005, 0.02)
  const phase = random(0, Math.PI * 2)

  let [x, y] = [x1, y1]
  if (x > w) {
    x = Math.min(w + 60, x)
  }
  y = a * x + b + amplitude * Math.sin(frequency * x + phase)

  return { x, y, a, b, amplitude, frequency, phase }
}
