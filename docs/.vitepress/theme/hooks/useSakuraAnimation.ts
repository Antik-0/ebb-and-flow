import { random, range } from '@repo/utils'
import { nextTick } from 'vue'
import sakuraURL from '@/sakura.png'

/**
 * 樱花动画配置
 */
const SakuraConfig = {
  /**
   * 樱花画布ID
   */
  canvasId: 'sakura-animation',
  /**
   * 樱花最大数量
   */
  createMaximum: 20,
  /**
   * 樱花创建间隔: ms
   */
  createInterval: 1000,
  /**
   * 樱花首次创建数量
   */
  createFirstNumber: [4, 8],
  /**
   * 樱花每次创建数量
   */
  createEachNumber: [1, 3],
  /**
   * 樱花飘落时间: s
   */
  duration: [8, 16],
  /**
   * 樱花粒子大小
   */
  size: [24, 24],
  /**
   * 樱花粒子尺寸
   */
  scaleLevels: [0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2]
} as const

interface Point {
  x: number
  y: number
}

interface SakuraOptions {
  source: ImageBitmap
  createTime: number
  canvasWidth: number
  canvasHeight: number
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
   * 动画是否结束
   */
  public finished = false
  /**
   * 图片源
   */
  #source: ImageBitmap

  constructor(options: SakuraOptions) {
    const { createTime, canvasWidth, canvasHeight } = options
    this.createTime = createTime

    const sakura = options.source
    this.#source = sakura
    this.edgeX = 0 - sakura.width
    this.edgeY = canvasHeight + sakura.height

    this.duration = random(...SakuraConfig.duration) * 1000
    this.angle = Math.floor(Math.random() * Math.PI * 2)
    this.rotateSpeed = (Math.random() - 0.5) * 0.1

    // 贝塞尔曲线轨迹
    // 起点
    const spx = random(0, canvasWidth) + canvasWidth * 0.25
    this.sp = { x: spx, y: 0 }
    // 终点
    const epx = random(0, canvasWidth) - canvasWidth * 0.5
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
  public animate(ctx: CanvasRenderingContext2D, t: number) {
    const elapsed = t - this.createTime
    const point = this.#getNextPoint(elapsed)

    if (this.isOffcanvas(point)) {
      this.finished = true
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

async function loadImage() {
  const image = new Image(...SakuraConfig.size)
  await new Promise(resolve => {
    image.src = sakuraURL
    image.onload = () => resolve(true)
  })
  return image
}

async function createSakuraImageList() {
  const sakuraImage = await loadImage()
  const { width, height } = sakuraImage

  const createImage = (level: number) => {
    const w = width * level
    const h = height * level

    const canvas = new OffscreenCanvas(w, h)
    const ctx = canvas.getContext('2d')
    if (ctx === null) return null

    ctx.drawImage(sakuraImage, 0, 0, w, h)

    return canvas.transferToImageBitmap()
  }

  const { scaleLevels } = SakuraConfig
  return scaleLevels.map(createImage).filter(item => item !== null)
}

export function useSakuraAnimation() {
  let canvas: HTMLCanvasElement
  let canvasCtx: CanvasRenderingContext2D
  let cancelled = false

  // 樱花粒子集合
  let sakuraList: Sakura[] = []
  // 预生成不同尺寸的樱花粒子
  let sakuraImageList: ImageBitmap[] = []
  // 创建时间戳
  let lastCreateTime: DOMHighResTimeStamp

  function createSakura(time: number) {
    const length = sakuraImageList.length
    const sakuraImage = sakuraImageList[random(0, length - 1)]!
    return new Sakura({
      source: sakuraImage,
      createTime: time,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    })
  }

  function animate(timestamp: DOMHighResTimeStamp) {
    if (cancelled) return

    const {
      createMaximum,
      createInterval,
      createFirstNumber,
      createEachNumber
    } = SakuraConfig

    if (lastCreateTime === undefined) {
      sakuraList = Array.from({
        length: random(...createFirstNumber)
      }).map(() => createSakura(timestamp))
      lastCreateTime = timestamp
    }

    if (timestamp - lastCreateTime > createInterval) {
      sakuraList = sakuraList.filter(sakura => !sakura.finished)
      for (const _ of range(random(...createEachNumber))) {
        if (sakuraList.length >= createMaximum) {
          break
        }
        sakuraList.push(createSakura(timestamp))
      }
      lastCreateTime = timestamp
    }

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    for (const sakura of sakuraList) {
      if (sakura.finished) continue
      sakura.animate(canvasCtx, timestamp)
    }

    requestAnimationFrame(animate)
  }

  function mount() {
    if (cancelled === false) return

    const { canvasId } = SakuraConfig
    canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.setAttribute('id', canvasId)
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.append(canvas)

    cancelled = false
    nextTick(async () => {
      if (sakuraImageList.length === 0) {
        // 预先生成不同尺寸樱花粒子
        sakuraImageList = await createSakuraImageList()
      }

      // 获取上下文
      canvasCtx = canvas.getContext('2d')!

      // 运行动画
      requestAnimationFrame(animate)
    })
  }

  function unmount() {
    cancelled = true
    canvas?.remove()
    canvas = null as any
    canvasCtx = null as any
    sakuraList = []
    sakuraImageList = []
    lastCreateTime = undefined as any
  }

  return { mount, unmount }
}
