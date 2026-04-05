import { random, range } from '@repo/utils'

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
    case 'stop': {
      stop()
      break
    }
    case 'update': {
      update(payload)
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

  sakuraImageList = await createSakuraImageList(payload.sakuraImage)
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
    const n = random(...SakuraConfig.initCount)
    generateSakuras(n, timestamp)
    lastCreateTime = timestamp
  }

  if (timestamp - lastCreateTime >= SakuraConfig.interval) {
    const n = random(...SakuraConfig.yieldCount)
    generateSakuras(n, timestamp)
    lastCreateTime = timestamp
  }

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

  for (const sakura of sakuraList.values()) {
    if (sakura.active) {
      sakura.animate(canvasCtx, timestamp)
    } else {
      clearSakura(sakura)
    }
  }

  animationFrame = self.requestAnimationFrame(animate)
}

function generateSakuras(n: number, time: number) {
  const createSakura = () => {
    const length = sakuraImageList.length
    const sakuraImage = sakuraImageList[random(0, length - 1)]!
    return new Sakura({
      source: sakuraImage,
      createTime: time
    })
  }

  for (const _ of range(n)) {
    sakuraList.add(createSakura())
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
   * 樱花出现的范围
   */
  startXRange: RangeNumber
  startYRange: RangeNumber
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
  /**
   * 樱花飘落时间(s)
   */
  duration: RangeNumber
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
  startXRange: [0.2, 1.4],
  startYRange: [0, 0.2],
  initCount: [2, 6],
  interval: 1000,
  yieldCount: [1, 3],
  duration: [8, 16],
  size: [24, 24],
  scaleLevels: [0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2]
}

interface SakuraOptions {
  source: ImageBitmap
  createTime: number
}

interface Point {
  x: number
  y: number
}

class Sakura {
  /**
   * 创建时间
   */
  public createTime: number
  /**
   * 控制状态
   */
  public duration: number // 动画时间: ms
  public angle: number // 旋转角度
  public rotateSpeed: number // 旋转的变化速度
  /**
   * 贝塞尔曲线
   */
  public cp: Point // 控制点
  public sp: Point // 起点
  public ep: Point // 终点
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

  constructor(options: SakuraOptions) {
    const cw = canvas.width
    const ch = canvas.height

    this.createTime = options.createTime
    const sakura = options.source
    this.#source = sakura
    this.edgeX = 0 - sakura.width
    this.edgeY = ch + sakura.height

    this.duration = random(...SakuraConfig.duration) * 1000
    this.angle = Math.floor(Math.random() * Math.PI * 2)
    this.rotateSpeed = (Math.random() - 0.5) * 0.1

    // 贝塞尔曲线轨迹
    // 起点
    const [spx, spy] = generateSakuraStartPoint()
    this.sp = { x: spx, y: spy }
    // 终点
    const epx = random(0, cw) - ch * 0.5
    this.ep = { x: epx, y: this.edgeY }
    // 控制点
    // 为了保证轨迹是向下的弧线，控制点随机分布在下 x 轴差 [0.25, 0.5]
    // 与 y 轴差 [0.75, 1] 所围成的矩形范围内
    const cpxStart = this.getPointAt(epx, spx, 0.25)
    const cpxEnd = this.getPointAt(epx, spx, 0.5)
    const cpyStart = this.getPointAt(0, this.ep.y, 0.75)
    const cpyEnd = this.ep.y
    this.cp = {
      x: random(cpxStart, cpxEnd),
      y: random(cpyStart, cpyEnd)
    }
    this.active = true
  }

  /**
   * 获取两点间的指定位置
   */
  public getPointAt(start: number, end: number, p: number) {
    return start + p * (end - start)
  }

  /**
   * 计算经过时间 `e`，贝塞尔曲线所在的坐标
   */
  #getNextPoint(e: number) {
    const { duration: d, cp, sp, ep } = this
    const t = Math.min(e / d, 1)

    const x = (1 - t) * (1 - t) * sp.x + 2 * (1 - t) * t * cp.x + t * t * ep.x
    const y = (1 - t) * (1 - t) * sp.y + 2 * (1 - t) * t * cp.y + t * t * ep.y

    return { x, y }
  }

  /**
   * 判断樱花是否落入屏幕外，飘落轨迹是从右上角到左下角
   */
  public isOffcanvas(p: Point) {
    const { x, y } = p
    return x <= this.edgeX || y >= this.edgeY
  }

  /**
   * 樱花飘落动画
   */
  public animate(ctx: OffscreenCanvasRenderingContext2D, t: number) {
    const elapsed = t - this.createTime
    const point = this.#getNextPoint(elapsed)

    if (this.isOffcanvas(point)) {
      this.active = false
      return
    }

    this.angle += this.rotateSpeed
    const width = this.#source.width
    const height = this.#source.height

    ctx.save()

    // 将画布移动樱花轨迹点
    ctx.translate(point.x, point.y)
    // 旋转画布
    ctx.rotate(this.angle)
    // 以当前轨迹点为原点，绘制樱花
    ctx.drawImage(this.#source, -(width / 2), -(height / 2))

    ctx.restore()
  }
}

function generateSakuraStartPoint(): [number, number] {
  const { startXRange, startYRange } = SakuraConfig
  const w = canvas.width
  const h = canvas.height

  let [x, y] = [random(w * startXRange[0], w * startXRange[1]), 0]
  if (x >= w) {
    x = w + 40
    y = random(h * startYRange[0], h * startYRange[1])
  }

  return [x, y]
}
