import sakuraURL from '@/sakura.png'
import { random } from '@repo/utils'
import { nextTick } from 'vue'

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
  public createTime: number
  public canvasWidth: number
  public canvasHeight: number
  /**
   * 控制状态
   */
  public d: number = undefined! // 动画时间: ms
  public angle: number = undefined! // 旋转角度
  public rotateSpeed: number = undefined! // 每帧旋转速度
  /**
   * 贝塞尔曲线
   */
  public cp: Point = undefined! // 控制点
  public sp: Point = undefined! // 起点
  public ep: Point = undefined! // 终点
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
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    const sakura = options.source
    this.#source = sakura
    this.edgeX = 0 - sakura.width
    this.edgeY = canvasHeight + sakura.height

    this.initState()
  }

  /**
   * 初始化状态
   */
  public initState() {
    this.d = random(10, 16) * 1000
    this.angle = Math.floor(Math.random() * Math.PI * 2)
    this.rotateSpeed = (Math.random() - 0.5) * 0.1

    const width = this.canvasWidth

    // 贝塞尔曲线轨迹
    // 起点
    const spx = random(0, width) + width * 0.5
    this.sp = { x: spx, y: 0 }
    // 终点
    const epx = random(0, width) - width
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
    const { d, cp, sp, ep } = this
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
  animate(ctx: CanvasRenderingContext2D, t: number) {
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
  const image = new Image(24, 24)
  await new Promise(resolve => {
    image.src = sakuraURL
    image.onload = () => resolve(true)
  })
  return image
}

async function createSakuraImageList() {
  const sakuraImage = await loadImage()
  const { width, height } = sakuraImage

  const scaleLevels = [0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.4, 1.2, 1, 0.8, 0.6]

  const createImage = (level: number) => {
    const w = width * level
    const h = height * level
    const canvas = new OffscreenCanvas(w, h)
    const ctx = canvas.getContext('2d')
    if (ctx === null) return null

    ctx.drawImage(sakuraImage, 0, 0, w, h)

    return canvas.transferToImageBitmap()
  }

  return scaleLevels.map(createImage).filter(item => item !== null)
}

export function useSakuraAnimation(canvasId = 'sakura-animation') {
  let canvas: HTMLCanvasElement | null = null
  let cancelled = false

  const state = {
    ctx: null! as CanvasRenderingContext2D,
    width: 0,
    height: 0
  }

  // 樱花粒子集合
  let sakuraImageList: ImageBitmap[] = []
  let sakuraList: Sakura[] = []

  const CREATE_INTERVAL = 1000
  let lastCreateTime: number = undefined!

  function createSakura(time: number) {
    const length = sakuraImageList.length
    const sakuraImage = sakuraImageList[random(0, length - 1)]!
    return new Sakura({
      source: sakuraImage,
      createTime: time,
      canvasWidth: state.width,
      canvasHeight: state.height
    })
  }

  function animate(timestamp: DOMHighResTimeStamp) {
    if (cancelled) return

    if (lastCreateTime === undefined) {
      sakuraList = Array.from({ length: 4 }).map(() => createSakura(timestamp))
      lastCreateTime = timestamp
    }

    if (timestamp - lastCreateTime > CREATE_INTERVAL) {
      sakuraList = sakuraList.filter(sakura => !sakura.finished)
      sakuraList.push(createSakura(timestamp))
      lastCreateTime = timestamp
    }

    const { ctx, width, height } = state
    ctx.clearRect(0, 0, width, height)
    for (const sakura of sakuraList) {
      if (sakura.finished) continue
      sakura.animate(ctx, timestamp)
    }

    requestAnimationFrame(animate)
  }

  async function requestAnimate() {
    if (!canvas) return

    if (sakuraImageList.length === 0) {
      // 创建樱花粒子
      sakuraImageList = await createSakuraImageList()
    }

    state.ctx = canvas.getContext('2d')!
    state.width = canvas.width
    state.height = canvas.height

    // 开启动画
    requestAnimationFrame(animate)
  }

  function install() {
    canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) {
      canvas = document.createElement('canvas')
    }
    canvas.setAttribute('id', canvasId)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.append(canvas)

    cancelled = false
    nextTick(requestAnimate)
  }

  function uninstall() {
    cancelled = true
    canvas?.remove()
    canvas = null
  }

  return { install, uninstall }
}
