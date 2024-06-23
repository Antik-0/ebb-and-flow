import { debounce } from 'lodash-es'

type MeteorState = 'appear' | 'vanish'

interface MeteorAnimationOptions {
  initArea: [number, number, number, number]
  boundary: [number, number, number]
  angle: [number, number]
  velocity: [number, number]
  duration: [number, number]
  interval: [number, number]
  maxCount: number
}

/**
 * 单位常量
 */
const PI = Math.PI
const turn = 2 * PI // 一圆周
const rad = turn / 360 // 一弧度

/**
 * 流星绘画配置
 */
const meteorConfig: MeteorAnimationOptions = {
  initArea: [0, 0, 0, 0], // 流星出现的区域：[x, y, width, height]
  boundary: [0, 0, 0], // 流星消失的边界：[左, 右, 下]
  angle: [20, 160], // 流星轨迹的顺时针角度范围
  velocity: [200, 300], // 流星的速率范围
  duration: [16, 20], // 流星的持续时间范围，单位：s
  interval: [1000, 1600], // 流星出现的间隔，单位：ms
  maxCount: 4 // 最多同时出现的流星数量
}

class Meteor {
  // 尺寸属性
  radius = 10
  bodyLength = 200
  tailLength = 1600

  // 颜色属性
  headColor = '#abced0'
  bodyColor = '#92b7b9'
  tailColor = '#8cabad'

  // 状态
  posX: number
  posY: number
  state: MeteorState = 'appear' // appear：出现；vanish：消失

  private velocity_X: number
  private velocity_Y: number
  private currDistance: number = 0 // 当前划过的距离
  private totalDistance: number // 需要划过的距离

  constructor(
    x: number,
    y: number,
    public angle: number,
    public velocity: number,
    public duration: number,
    public boundary: [number, number, number]
  ) {
    // 流星当前位置
    this.posX = x
    this.posY = y

    this.angle = angle
    this.velocity = velocity
    this.duration = duration
    this.boundary = boundary
    this.totalDistance = velocity * duration

    // 速率分量，单位转为：ms
    this.velocity_X = (velocity * Math.cos(angle * rad)) / 1000
    this.velocity_Y = (velocity * Math.sin(angle * rad)) / 1000
  }

  // 计算流星当前的位置
  calcPosition(elapsedTime: number) {
    // 时间周期经过的距离，时间单位是ms，速度单位是s
    const elapsedDistance = (elapsedTime * this.velocity) / 1000
    this.currDistance += elapsedDistance
    this.posX += elapsedTime * this.velocity_X
    this.posY += elapsedTime * this.velocity_Y
    return [this.posX, this.posY]
  }

  // 更新流星的状态
  updateState() {
    if (this.currDistance >= this.totalDistance || this.#detectionBoundary()) {
      this.state = 'vanish'
    }
  }

  // 边界检测：屏幕的宽度*设置的高度
  #detectionBoundary() {
    const x = this.posX
    const y = this.posY
    const [boundaryLeft, boundaryRight, boundaryBottom] = this.boundary
    return x <= boundaryLeft || x >= boundaryRight || y >= boundaryBottom
  }
}

function rangeRandom(range: [number, number]) {
  return Math.random() * (range[1] - range[0]) + range[0]
}

function createMeteor() {
  const { initArea, boundary } = meteorConfig
  const x = Math.random() * initArea[2] + initArea[0]
  const y = Math.random() * initArea[3] + initArea[1]

  const angle = rangeRandom(meteorConfig.angle)
  const velocity = rangeRandom(meteorConfig.velocity)
  const duration = rangeRandom(meteorConfig.duration)
  return new Meteor(x, y, angle, velocity, duration, boundary)
}

function drawMeteorTrack(ctx: CanvasRenderingContext2D, meteor: Meteor) {
  ctx.save()

  // 将画布中点移动到流星当前位置
  const { posX, posY } = meteor
  ctx.translate(posX, posY)
  // 将画布顺时针旋转至流星轨迹的方向
  ctx.rotate(meteor.angle * rad)

  function drawMeteor() {
    ctx.save()

    // 下文会将画布转换为一个笛卡尔坐标系，其中Y轴正方向将与流星轨道垂直
    // 因此，逆时针旋转90°，使绘制后的流星方向与轨迹一致
    ctx.rotate(-(90 * rad))

    // 翻转Y轴，建立笛卡尔坐标系
    ctx.scale(1, -1)
    ctx.scale(0.2, 0.2)

    const createGasGradient = (length: number, color: string) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, length)
      gradient.addColorStop(0, color)
      gradient.addColorStop(0.8, 'transparent')
      return gradient
    }

    // 流星尾部
    const { radius, tailLength, tailColor } = meteor
    ctx.beginPath()
    ctx.fillStyle = createGasGradient(tailLength, tailColor)
    ctx.moveTo(-radius, 0)
    ctx.lineTo(0, tailLength)
    ctx.lineTo(radius, 0)
    ctx.fill()

    // 流星中间
    const { bodyLength, bodyColor } = meteor
    ctx.beginPath()
    ctx.fillStyle = createGasGradient(bodyLength, bodyColor)
    ctx.moveTo(-radius, 0)
    ctx.lineTo(0, bodyLength)
    ctx.lineTo(radius, 0)
    ctx.fill()

    // 流星头部
    const { headColor } = meteor
    ctx.beginPath()
    ctx.fillStyle = headColor
    ctx.arc(0, 0, radius, 0, turn)
    ctx.fill()

    ctx.restore()
  }
  drawMeteor()

  ctx.restore()
}

export function useMeteorAnimation() {
  // 创建画布
  const canvasId = 'meteor-animation'
  let canvasDOM = document.getElementById(canvasId)
  if (canvasDOM === null) {
    canvasDOM = document.createElement('canvas')
    canvasDOM.setAttribute('id', canvasId)
    document.body.appendChild(canvasDOM)
  }

  const canvas = canvasDOM as HTMLCanvasElement
  // html.clientWidth 不包含滚动条宽度
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight

  const ctx = canvas.getContext('2d')!

  let width = 0
  let height = 0

  const { maxCount, interval: intervalRange } = meteorConfig
  let meteorList: (Meteor | null)[] = new Array(maxCount).fill(null) // 流星集合
  let insertIndex = 0 // 流星集合空闲的位置指针

  let interval = 0
  let countTime = 0
  let prevAnimationTimeStamp: number | undefined = undefined
  let rafId: number | undefined = undefined

  function init() {
    width = canvas.width
    height = canvas.height

    meteorConfig.initArea = [0, 0, width, 100]
    meteorConfig.boundary = [0, width, height / 2]

    meteorList = new Array(maxCount).fill(null)
    insertIndex = 0

    interval = rangeRandom(intervalRange)
    countTime = 0
    prevAnimationTimeStamp = undefined
    rafId && cancelAnimationFrame(rafId)

    // 运行动画
    rafId = requestAnimationFrame(animate)
  }

  // 检查流星集合中是否有空闲的位置
  function isIdle() {
    if (insertIndex >= maxCount) return false
    if (meteorList[insertIndex] === null) return true
    if (meteorList[insertIndex]!.state === 'vanish') return true

    while (insertIndex < maxCount && meteorList[insertIndex] !== null) {
      insertIndex += 1
    }
    return insertIndex < maxCount
  }

  function animate(timeStamp: number) {
    // 第一个动画周期不做任何事情
    if (prevAnimationTimeStamp === undefined) {
      prevAnimationTimeStamp = timeStamp
      return requestAnimationFrame(animate)
    }

    ctx.save()
    ctx.clearRect(0, 0, width, height)
    const elapsedTime = timeStamp - prevAnimationTimeStamp
    prevAnimationTimeStamp = timeStamp

    // 每隔一段时间尝试创建一个流星
    countTime += elapsedTime
    if (countTime >= interval && isIdle()) {
      meteorList[insertIndex] = createMeteor()
      interval = rangeRandom(intervalRange)
      countTime = 0
    }

    // 遍历流星集合绘制
    meteorList.forEach((meteor, index) => {
      if (meteor === null || meteor.state === 'vanish') {
        return
      }

      // 计算流星当前的位置
      meteor.calcPosition(elapsedTime)
      // 更新流星的状态
      meteor.updateState()

      if ((meteor.state as MeteorState) !== 'vanish') {
        // 绘制流星轨迹
        drawMeteorTrack(ctx, meteor)
      } else {
        insertIndex = index
      }
    })

    ctx.restore()
    rafId = requestAnimationFrame(animate)
  }

  init()

  // resize handler
  const resizeCallback = () => {
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight
    init()
  }
  const observer = new ResizeObserver(debounce(resizeCallback, 400))
  observer.observe(document.documentElement)
}
